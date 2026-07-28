import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.crm import CRMLead, CRMLeadCreate, CRMLeadUpdate
from app.db.store import db_store

router = APIRouter(prefix="/crm", tags=["CRM"])

@router.get("", response_model=List[CRMLead])
def list_crm_leads():
    return db_store.list_crm_leads()

@router.post("", response_model=CRMLead)
def create_crm_lead(req: CRMLeadCreate):
    lead_id = f"lead-{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow()
    lead_data = {
        "id": lead_id,
        "company_name": req.company_name,
        "domain": req.domain,
        "url": req.url,
        "audit_id": req.audit_id,
        "contact_name": req.contact_name,
        "contact_email": req.contact_email,
        "status": req.status,
        "owner": req.owner,
        "estimated_arr_lift": req.estimated_arr_lift,
        "notes": req.notes,
        "tags": req.tags,
        "follow_up_date": req.follow_up_date,
        "last_contacted": req.last_contacted,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    db_store.save_crm_lead(lead_data)
    return lead_data

@router.patch("/{lead_id}", response_model=CRMLead)
def update_crm_lead(lead_id: str, req: CRMLeadUpdate):
    existing = db_store.get_crm_lead(lead_id)
    if not existing:
        raise HTTPException(status_code=404, detail="CRM lead not found")
    
    update_data = req.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        if val is not None:
            existing[key] = val
            
    existing["updated_at"] = datetime.utcnow().isoformat()
    db_store.save_crm_lead(existing)
    return existing

@router.delete("/{lead_id}")
def delete_crm_lead(lead_id: str):
    success = db_store.delete_crm_lead(lead_id)
    if not success:
        raise HTTPException(status_code=404, detail="CRM lead not found")
    return {"message": "Lead deleted", "id": lead_id}
