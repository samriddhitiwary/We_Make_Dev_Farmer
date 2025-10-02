from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
from tensorflow.keras.activations import softmax
from PIL import Image
import numpy as np
from io import BytesIO

router = APIRouter()

# Load Quality Model
QUALITY_MODEL_PATH = r"C:\Users\samri\cod\git\Farmer\Machine_Learning\Crop Quality Grading\best_model.h5"
QUALITY_INPUT_SIZE = (180, 180)
QUALITY_BACKEND_CLASSES = ['Bad Quality_Fruits', 'Good Quality_Fruits', 'Mixed Qualit_Fruits']
QUALITY_OUTPUT_GRADES = ['C', 'A', 'B']

try:
    quality_model = load_model(QUALITY_MODEL_PATH, compile=False)
except Exception as e:
    print(f"Error loading Quality Model: {e}")
    quality_model = None

@router.post("/api/grade_crop")
async def grade_crop(file: UploadFile = File(...)):
    if quality_model is None:
        raise HTTPException(status_code=503, detail="Quality model is not loaded.")
    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert('RGB').resize(QUALITY_INPUT_SIZE)
        img_array = np.expand_dims(np.array(img, dtype=np.float32), axis=0)
        prediction_output = quality_model.predict(img_array)
        probs = softmax(prediction_output[0]).numpy()
        predicted_index = int(np.argmax(probs))
        predicted_grade = QUALITY_OUTPUT_GRADES[predicted_index]
        confidence = float(probs[predicted_index] * 100)
        probability_map = {
            f'{QUALITY_OUTPUT_GRADES[i]} ({QUALITY_BACKEND_CLASSES[i]})': f"{probs[i]*100:.2f}%"
            for i in range(len(QUALITY_BACKEND_CLASSES))
        }

        return {
            "grade": predicted_grade,
            "confidence": confidence,
            "all_probabilities": probability_map
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in grading: {e}")
