from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from utils.verifier import verify_pdf_against_template

app = FastAPI(title="PDF Verification Service", version="1.0")

class VerifyRequest(BaseModel):
    pdf_url: str
    template_version: str = "v1"

@app.get("/health")
def health():
    return {"ok": True, "service": "pdf-verifier"}

@app.post("/verify")
def verify(req: VerifyRequest):
    try:
        r = requests.get(req.pdf_url, timeout=40)
        r.raise_for_status()
        pdf_bytes = r.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to download PDF: {e}")

    try:
        result = verify_pdf_against_template(pdf_bytes, template_version=req.template_version)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification engine error: {e}")