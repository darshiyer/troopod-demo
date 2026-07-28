import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List

from app.schemas.audit import AuditRequest, AuditResult, AuditSummaryItem
from app.services.scraper_service import ScraperService
from app.services.vision_service import VisionService
from app.services.pagespeed_service import PageSpeedService
from app.services.ai_analyzer_service import AIAnalyzerService
from app.services.competitor_service import CompetitorService
from app.db.store import db_store

router = APIRouter(prefix="/audits", tags=["Audits"])

@router.post("/scan", response_model=AuditResult)
async def scan_website(req: AuditRequest):
    url = req.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="Website URL is required.")

    # Scrape
    metadata, extracted, domain = await ScraperService.scrape_url(url)
    company_name = domain.replace(".com", "").replace(".co", "").replace(".io", "").capitalize()

    # Vision & Layout
    vision = VisionService.analyze_layout(extracted, domain)

    # PageSpeed
    pagespeed = PageSpeedService.evaluate_performance(domain)

    # AI CRO Analysis & Revenue Opportunity
    c_score, t_score, u_score, r_score, copy_score, overall, summary, friction, recs, rev_opp = AIAnalyzerService.run_cro_analysis(
        domain, metadata, extracted, pagespeed, vision
    )

    # Competitors
    competitors = CompetitorService.get_competitors(domain)

    audit_id = f"audit-{uuid.uuid4().hex[:8]}"

    audit_result = AuditResult(
        id=audit_id,
        url=url if url.startswith("http") else f"https://{url}",
        company_name=company_name,
        domain=domain,
        created_at=datetime.utcnow(),
        status="completed",
        progress_step="Completed",
        progress_percent=100,
        metadata=metadata,
        extracted_elements=extracted,
        pagespeed=pagespeed,
        vision=vision,
        analysis=summary,
        conversion_score=c_score,
        trust_score=t_score,
        ux_score=u_score,
        readability_score=r_score,
        copy_score=copy_score,
        overall_growth_score=overall,
        friction_points=friction,
        recommendations=recs,
        revenue_opportunity=rev_opp,
        competitors=competitors
    )

    # Save in store
    db_store.save_audit(audit_result.model_dump())

    # Automatically create a default CRM lead if not present
    lead_id = f"lead-{uuid.uuid4().hex[:8]}"
    db_store.save_crm_lead({
        "id": lead_id,
        "company_name": company_name,
        "domain": domain,
        "url": audit_result.url,
        "audit_id": audit_id,
        "contact_name": "E-Commerce Growth Lead",
        "contact_email": f"growth@{domain}",
        "status": "New",
        "owner": "Growth Team",
        "estimated_arr_lift": rev_opp.annual_revenue_lift,
        "notes": f"Scanned on {datetime.utcnow().strftime('%Y-%m-%d')}. Score: {overall}/100.",
        "tags": ["E-Commerce", "Audit Complete"],
        "follow_up_date": None,
        "last_contacted": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    })

    return audit_result

@router.get("", response_model=List[AuditSummaryItem])
def list_audits():
    audits = db_store.list_audits()
    items = []
    for a in audits:
        items.append(AuditSummaryItem(
            id=a["id"],
            url=a["url"],
            company_name=a["company_name"],
            domain=a["domain"],
            created_at=a["created_at"],
            overall_growth_score=a.get("overall_growth_score", 75),
            conversion_score=a.get("conversion_score", 70),
            annual_revenue_lift=a.get("revenue_opportunity", {}).get("annual_revenue_lift", 120000.0),
            status=a.get("status", "completed")
        ))
    return items

@router.get("/{audit_id}", response_model=AuditResult)
def get_audit(audit_id: str):
    audit = db_store.get_audit(audit_id)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    return audit

@router.delete("/{audit_id}")
def delete_audit(audit_id: str):
    success = db_store.delete_audit(audit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Audit not found")
    return {"message": "Audit deleted successfully", "id": audit_id}
