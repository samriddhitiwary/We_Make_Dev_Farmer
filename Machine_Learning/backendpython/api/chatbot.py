# api/openai_chat.py
from fastapi import APIRouter
from pydantic import BaseModel
import openai

openai.api_key =  "" 
router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a farming assistant."},
            {"role": "user", "content": request.message}
        ]
    )
    return {"reply": response.choices[0].message.content}
