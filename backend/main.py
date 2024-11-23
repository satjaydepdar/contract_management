from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routers import documents, qa, feedback
import uvicorn

app = FastAPI(
    title="Document QA API",
    description="API for document processing and question answering",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    documents.router,
    prefix=get_settings().api_v1_prefix + "/documents",
    tags=["documents"]
)
app.include_router(
    qa.router,
    prefix=get_settings().api_v1_prefix + "/qa",
    tags=["qa"]
)
app.include_router(
    feedback.router,
    prefix=get_settings().api_v1_prefix + "/feedback",
    tags=["feedback"]
)

@app.get("/")
async def root():
    return {"message": "Document QA API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if get_settings().debug else False
    )