# api/crop_recommendation.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(
    BASE_DIR,
    "..", "..", "Soil Classification", "crop_yield_dataset.csv"
)
DATA_PATH = os.path.normpath(DATA_PATH)

# --- Load dataset ---
df = pd.read_csv(DATA_PATH)

# Handle Date and Season
if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df['Month'] = df['Date'].dt.month
else:
    df['Month'] = pd.Series([1]*len(df))

def month_to_season(month):
    if month in [12, 1, 2]: return 'Winter'
    elif month in [3, 4, 5]: return 'Spring'
    elif month in [6, 7, 8]: return 'Summer'
    else: return 'Autumn'

df['Season'] = df['Month'].apply(month_to_season)
le_season = LabelEncoder()
df['Season_enc'] = le_season.fit_transform(df['Season'])

# Encode crop labels
le_crop = LabelEncoder()
df['Crop_enc'] = le_crop.fit_transform(df['Crop_Type'])

# Compute average values per Soil_Type
soil_avg = df.groupby('Soil_Type').mean(numeric_only=True)

# --- Load XGBoost model ---
MODEL_PATH = os.path.join(
    BASE_DIR,
    "..", "..", "Soil Classification", "best_crop_model.json"
)
MODEL_PATH = os.path.normpath(MODEL_PATH)
bst = xgb.Booster()
bst.load_model(MODEL_PATH)

FEATURES = ['Soil_Type','Soil_pH','Temperature','Humidity','N','P','K','Soil_Quality','Month','Season_enc']

# --- Pydantic schema ---
class CropRequest(BaseModel):
    Soil_Type: str
    Month: int
    Soil_pH: float = None
    Temperature: float = None
    Humidity: float = None
    N: float = None
    P: float = None
    K: float = None
    Soil_Quality: float = None

# --- API endpoint ---
@router.post("/api/recommend_crop")
def recommend_crop(request: CropRequest):
    soil = request.Soil_Type
    month = request.Month
    
    # Validate soil type
    if soil not in soil_avg.index:
        raise HTTPException(status_code=400, detail="Invalid Soil_Type")
    
    # Fill missing values with soil-type averages
    defaults = soil_avg.loc[soil]
    input_data = {
        'Soil_Type': [soil],  # keep as string for categorical
        'Soil_pH': [request.Soil_pH if request.Soil_pH is not None else defaults['Soil_pH']],
        'Temperature': [request.Temperature if request.Temperature is not None else defaults['Temperature']],
        'Humidity': [request.Humidity if request.Humidity is not None else defaults['Humidity']],
        'N': [request.N if request.N is not None else defaults['N']],
        'P': [request.P if request.P is not None else defaults['P']],
        'K': [request.K if request.K is not None else defaults['K']],
        'Soil_Quality': [request.Soil_Quality if request.Soil_Quality is not None else defaults['Soil_Quality']],
        'Month': [month],
        'Season_enc': [le_season.transform([month_to_season(month)])[0]]
    }

    X = pd.DataFrame(input_data)[FEATURES]

    # Mark categorical column
    X['Soil_Type'] = X['Soil_Type'].astype('category')

    # Create DMatrix with categorical support
    dmatrix = xgb.DMatrix(X, enable_categorical=True)

    # Predict
    pred = bst.predict(dmatrix)

    # If model trained with multi:softmax, pred is already class index
    best_crop_idx = int(pred[0])
    best_crop_name = le_crop.inverse_transform([best_crop_idx])[0]

    return {"recommended_crop": best_crop_name}
