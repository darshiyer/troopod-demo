from typing import Optional, List
from pydantic import BaseModel

class OutreachAsset(BaseModel):
    id: str
    channel: str  # cold_email, linkedin_inmail, twitter_dm, follow_up_email, founder_intro, sales_proposal
    title: str
    subject_line: Optional[str] = None
    body_content: str
    target_role: str
    tone: str  # direct, consultative, high_urgency

class OutreachCampaignRequest(BaseModel):
    audit_id: str
    target_persona: Optional[str] = "VP of Growth / E-commerce Director"
    tone_preference: Optional[str] = "consultative"

class OutreachCampaignResponse(BaseModel):
    audit_id: str
    company_name: str
    domain: str
    cold_email: OutreachAsset
    linkedin_message: OutreachAsset
    twitter_dm: OutreachAsset
    follow_up_email: OutreachAsset
    founder_intro: OutreachAsset
    sales_proposal: OutreachAsset
