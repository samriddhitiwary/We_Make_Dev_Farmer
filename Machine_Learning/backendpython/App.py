from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.grade_crop import router as grade_crop_router
from api.detect_disease import router as detect_disease_router
from api.mandi_price import router as mandi_price_router  # <-- import mandi_price router
# from api.crop_recommendation import  router as recommend_crop;
from api.chatbot import router as chatbot;
import uvicorn

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(grade_crop_router)
app.include_router(detect_disease_router)
app.include_router(mandi_price_router)  # <-- include it here
# app.include_router(recommend_crop) 

app.include_router(chatbot) 

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
