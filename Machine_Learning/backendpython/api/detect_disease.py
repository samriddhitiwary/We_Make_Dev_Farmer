from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
from tensorflow.keras.activations import softmax
from PIL import Image
import numpy as np
from io import BytesIO
import httpx
import os

router = APIRouter()

# Load Disease Model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DISEASE_MODEL_PATH = os.path.join(
    BASE_DIR,
    "..", "..", "Crop Disease Detection", "new_leaf_disease_model.h5"
)
DISEASE_MODEL_PATH = os.path.normpath(DISEASE_MODEL_PATH)

DISEASE_INPUT_SIZE = (180, 180)
DISEASE_CLASSES = [
    'Pepper__bell___Bacterial_spot',
    'Pepper__bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Tomato_Bacterial_spot',
    'Tomato_Early_blight',
    'Tomato_Late_blight',
    'Tomato_Leaf_Mold',
    'Tomato_Septoria_leaf_spot',
    'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Tomato__Target_Spot',
    'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato__Tomato_mosaic_virus',
    'Tomato_healthy'
]

HF_BASE_URL = "https://router.huggingface.co/v1"
HF_API_KEY = ""
HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct:nebius"

try:
    disease_model = load_model(DISEASE_MODEL_PATH, compile=False)
except Exception as e:
    print(f"Error loading Disease Model: {e}")
    disease_model = None

async def get_remedy_from_llama(disease_name: str):
    prompt = (
        f"You are an agricultural expert. Provide remedies for the crop disease: {disease_name}.\n"
        "Respond in this format:\n\n"
        "## Identification Summary\n"
        "...\n\n"
        "## Organic Control\n"
        "...\n\n"
        "## Chemical Control\n"
        "..."
    )

    headers = {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "system", "content": "You are a crop disease management assistant."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 400,
        "temperature": 0.7
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{HF_BASE_URL}/chat/completions", headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"LLaMA API error: {response.text}")
        return response.json()["choices"][0]["message"]["content"]

@router.post("/api/detect_disease")
async def detect_disease(file: UploadFile = File(...)):
    if disease_model is None:
        raise HTTPException(status_code=503, detail="Disease model is not loaded.")
    try:
        print("Step 1 "*10)
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert('RGB').resize(DISEASE_INPUT_SIZE)
        print("Step 2 "*10)
        img_array = np.expand_dims(np.array(img, dtype=np.float32), axis=0)
        prediction_output = disease_model.predict(img_array)
        probs = softmax(prediction_output[0]).numpy()
        print("Step 3 "*10)
        predicted_index = int(np.argmax(probs))
        predicted_class = DISEASE_CLASSES[predicted_index]
        print("Step 4 "*10)
        confidence = float(probs[predicted_index] * 100)
        status = "Healthy" if "healthy" in predicted_class.lower() else "Disease Detected"
        probability_map = {c: f"{p*100:.2f}%" for c, p in zip(DISEASE_CLASSES, probs)}
        print(f"Step 5  {probability_map}")
        remedy_text = None
        if status == "Disease Detected":
            remedy_text = await get_remedy_from_llama(predicted_class)

        return {
            "disease_name": predicted_class,
            "status": status,
            "confidence": confidence,
            "all_probabilities": probability_map,
            "remedy": remedy_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in disease detection: {e}")
