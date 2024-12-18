# app/main.py

from fastapi import FastAPI
from routers import medical_image_analysis, medicalChatBot, medicalSummarization, drug_image_analysis, patient_image_analysis, patient_drug_analysis
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)




# Register routers
app.include_router(medical_image_analysis.router, prefix="/doc", tags=["doctor"])
app.include_router(drug_image_analysis.router, prefix="/doc", tags=['doctor'])
app.include_router(patient_image_analysis.router, prefix="/patient", tags=['patient'])
app.include_router(patient_drug_analysis.router, prefix="/patient", tags=['patient'])
app.include_router(medicalSummarization.router, prefix="/report-summarize", tags=["summarize"])
app.include_router(medicalChatBot.router, prefix="/chatbot", tags=["bot"])