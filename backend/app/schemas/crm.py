from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class CRMLeadBase(BaseModel):
    company_name: str
    domain: str
    url: str
    audit_id: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    status: str = "New"  # New, Contacted, Demo Scheduled, Proposal Sent, Closed Won, Closed Lost
    owner: str = "Growth Team"
    estimated_arr_lift: float = 0.0
    notes: Optional[str] = None
    tags: List[str] = []
    follow_up_date: Optional[str] = None
    last_contacted: Optional[str] = None

class CRMLeadCreate(CRMLeadBase):
    pass

class CRMLeadUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    status: Optional[str] = None
    owner: Optional[str] = None
    estimated_arr_lift: Optional[float] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    follow_up_date: Optional[str] = None
    last_contacted: Optional[str] = None

class CRMLead(CRMLeadBase):
    id: str
    created_at: datetime
    updated_at: datetime
