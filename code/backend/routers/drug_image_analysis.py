import logging
from fastapi import APIRouter
from utils.checker import drug_doc_report
from utils.prompts import doc_drug_prompt
from utils.utility import get_api_key, set_gemini_api_key, set_gemini_config
from fastapi import  File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

api_key = get_api_key()
# Set up the FastAPI app
router = APIRouter()

#prompt
prompt = doc_drug_prompt

# Configure the Generative AI model
set_gemini_api_key(api_key)

#configs are coming from Config file
model = set_gemini_config()

@router.post("/drug-analysis", response_class= JSONResponse)
async def analyze_image(file: UploadFile = File(...)):
    # Check if the file is an image
    if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        logging.error("Error in image type!!!")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PNG or JPG image.")
    
    # Read the image data
    image_data = await file.read()

    # Prepare the image and prompt for the model
    image_parts = [
        {
            "mime_type": file.content_type,
            "data": image_data
        }
    ]
    
    # Assuming `system_prompts` is a string containing the system's prompt
    prompt_parts = [
        image_parts[0],
        prompt
    ]

    # Generate the content using the AI model
    # Generate the content using the AI model
    try:
        response = model.generate_content(prompt_parts)
        logging.info("Got the resonpse")
        
    except Exception as e:
        logging.error(f"Error generating content: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate content from the model.")
    
    
    logging.info("Success in generating response")

    report_sections = drug_doc_report(response.text)
    return JSONResponse(report_sections)