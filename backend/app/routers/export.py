import csv
import io
from fastapi import APIRouter, Response
from app.db.store import db_store

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/csv")
def export_audits_csv():
    audits = db_store.list_audits()
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Audit ID", "Company Name", "Domain", "URL", "Created At",
        "Overall Score", "Conversion Score", "Trust Score", "UX Score",
        "Est. Annual Revenue Lift", "Status"
    ])

    for a in audits:
        rev_lift = a.get("revenue_opportunity", {}).get("annual_revenue_lift", 0.0)
        writer.writerow([
            a.get("id"),
            a.get("company_name"),
            a.get("domain"),
            a.get("url"),
            a.get("created_at"),
            a.get("overall_growth_score"),
            a.get("conversion_score"),
            a.get("trust_score"),
            a.get("ux_score"),
            f"${rev_lift:,.2f}",
            a.get("status")
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=Troopod_Audits_Export.csv"
        }
    )
