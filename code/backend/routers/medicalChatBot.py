
from fastapi import APIRouter
from pydantic import BaseModel
from utils.checker import report_generator
from utils.prompts import doc_image_prompt
from utils.utility import get_api_key, set_gemini_api_key, set_gemini_config
from fastapi import File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

api_key = get_api_key()
prompt = doc_image_prompt

# Set up the FastAPI app
router = APIRouter()



class ChatMessage(BaseModel):
    message: str

# Configure the Generative AI model
set_gemini_api_key(api_key)

#configs are coming from Config file
model = set_gemini_config()



chat = model.start_chat(history=[])


@router.post("/chat")
async def chat_endpoint(chat_message: ChatMessage):
    try:
        response = chat.send_message(chat_message.message)
        return {"response": response.text}
    except Exception as e:
        return {"error": str(e)}
