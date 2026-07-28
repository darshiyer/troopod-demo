from fastapi import APIRouter
from app.schemas.outreach import OutreachCampaignRequest, OutreachCampaignResponse
from app.services.outreach_service import OutreachService

router = APIRouter(prefix="/outreach", tags=["Outreach"])

@router.post("/generate", response_model=OutreachCampaignResponse)
def generate_outreach(req: OutreachCampaignRequest):
    return OutreachService.generate_campaign(req)
