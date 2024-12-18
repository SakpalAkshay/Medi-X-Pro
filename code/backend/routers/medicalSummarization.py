from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import io
from transformers import pipeline
from fastapi import APIRouter
router = APIRouter()

def get_pdf_text(pdf_file: io.BytesIO) -> str:
    text = ""
    # Initialize PdfReader with the BytesIO object
    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

@router.post("/", response_class=JSONResponse)
async def extract_pdf_text(file: UploadFile = File(...)):
    # Check if the uploaded file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")
    
    # Read the PDF content into memory as bytes
    pdf_data = await file.read()
    
    # Wrap the bytes in a BytesIO object
    pdf_file = io.BytesIO(pdf_data)
    
    # Extract text from the PDF
    text = get_pdf_text(pdf_file)

    from transformers import pipeline

    summarizer = pipeline("summarization", model="Falconsai/medical_summarization")


    
    obtained_text = summarizer(text, max_length=800, min_length=500, do_sample=False)


    return JSONResponse({"summarized_text":obtained_text[0]["summary_text"]})



