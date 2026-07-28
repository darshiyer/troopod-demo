from fastapi import APIRouter, Response
from app.services.pdf_service import PDFService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/pdf/{audit_id}")
def download_pdf_report(audit_id: str):
    pdf_bytes = PDFService.generate_pdf_report(audit_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=GrowthPilot_Audit_{audit_id}.pdf"
        }
    )
