from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import xgboost as xgb
import pandas as pd
import datetime
import os

router = APIRouter()

class MandiInput(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    variety: str = None
    grade: str = None
    date: str = None

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(
    BASE_DIR,
    "..", "..", "AI Prices Mandi Predictor"
)
MODEL_DIR = os.path.normpath(MODEL_DIR)

with open(f"{MODEL_DIR}/aimandi_predictor_Min_Price.pkl", "rb") as f:
    min_model = pickle.load(f)

with open(f"{MODEL_DIR}/aimandi_predictor_Max_Price.pkl", "rb") as f:
    max_model = pickle.load(f)

with open(f"{MODEL_DIR}/aimandi_predictor_Modal_Price.pkl", "rb") as f:
    modal_model = pickle.load(f)

def prepare_features(data: MandiInput):
    dt = datetime.datetime.strptime(data.date, "%Y-%m-%d") if data.date else datetime.datetime.today()
    df = pd.DataFrame({
        'STATE': [0],
        'District Name': [0],
        'Market Name': [0],
        'Commodity': [0],
        'Variety': [0],
        'Grade': [0],
        'Year': [dt.year],
        'Month': [dt.month],
        'Day': [dt.day],
        'DayOfWeek': [dt.weekday()],
        'WeekOfYear': [dt.isocalendar()[1]],
        'Season_enc': [0],
        'Min_Price_lag1': [2172],
        'Min_Price_lag2': [0],
        'Min_Price_lag3': [0],
        'Max_Price_lag1': [2399],
        'Max_Price_lag2': [0],
        'Max_Price_lag3': [0],
        'Modal_Price_lag1': [2300],
        'Modal_Price_lag2': [0],
        'Modal_Price_lag3': [0]
    })
    return df


@router.post("/api/predict_mandi_price")
def predict_mandi_price(input_data: MandiInput):
    try:
        features = prepare_features(input_data)
        dtest = xgb.DMatrix(features)
        min_price = float(min_model.predict(dtest)[0])
        max_price = float(max_model.predict(dtest)[0])
        modal_price = float(modal_model.predict(dtest)[0])
        return {
            "state": input_data.state,
            "district": input_data.district,
            "market": input_data.market,
            "commodity": input_data.commodity,
            "predicted_min_price": round(min_price, 2),
            "predicted_max_price": round(max_price, 2),
            "predicted_modal_price": round(modal_price, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
