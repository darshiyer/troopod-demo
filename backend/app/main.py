import uuid
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.routers import audits, crm, outreach, rewrites, reports, export, health
from app.db.store import db_store

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AI Growth Audit & Sales Automation API for E-Commerce Brands"
)

# Enable CORS for Next.js frontend & production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(audits.router, prefix=settings.API_V1_STR)
app.include_router(crm.router, prefix=settings.API_V1_STR)
app.include_router(outreach.router, prefix=settings.API_V1_STR)
app.include_router(rewrites.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Seed initial demo audits if store is empty
    if not db_store.list_audits():
        seed_id = "audit-demo101"
        now = datetime.utcnow()
        sample_audit = {
            "id": seed_id,
            "url": "https://allbirds.com",
            "company_name": "Allbirds",
            "domain": "allbirds.com",
            "created_at": now.isoformat(),
            "status": "completed",
            "progress_step": "Completed",
            "progress_percent": 100,
            "conversion_score": 78,
            "trust_score": 85,
            "ux_score": 88,
            "readability_score": 90,
            "copy_score": 76,
            "overall_growth_score": 82,
            "metadata": {
                "title": "Allbirds - Sustainable & Comfortable Shoes & Clothing",
                "description": "Discover sustainable, comfortable shoes and apparel crafted with natural materials.",
                "og_title": "Allbirds Sustainable Shoes",
                "og_description": "Eco-friendly footwear.",
                "og_image": "https://allbirds.com/og.jpg",
                "canonical_url": "https://allbirds.com",
                "robots": "index, follow",
                "has_sitemap": True,
                "has_schema_markup": True
            },
            "extracted_elements": {
                "headlines": ["Super Light. Super Comfortable.", "Meet the Tree Runner Go", "Crafted with Natural Materials"],
                "ctas": ["Shop Men", "Shop Women", "Explore Sustainability"],
                "testimonials": ["\"Most comfortable shoes I have ever owned.\" — GQ", "\"Felt like walking on clouds from Day 1.\" — Verified Buyer"],
                "products": ["Tree Runner Go", "Wool Runner 2", "Tree Dasher 2"],
                "navigation_links": ["Men", "Women", "New Arrivals", "Sale"],
                "pricing_mentions": ["$100", "$120", "Free shipping on orders over $75"],
                "trust_badges": ["Certified B Corp", "Free 30-Day Returns", "Carbon Neutral"],
                "has_live_chat": True,
                "has_popups": True,
                "form_count": 2
            },
            "pagespeed": {
                "performance_score": 82,
                "accessibility_score": 94,
                "best_practices_score": 90,
                "seo_score": 92,
                "lcp_seconds": 1.9,
                "inp_ms": 110,
                "cls_score": 0.03
            },
            "vision": {
                "visual_hierarchy_score": 88,
                "cta_placement_score": 84,
                "whitespace_score": 90,
                "contrast_score": 86,
                "button_visibility_score": 85,
                "readability_score": 92,
                "accessibility_score": 90,
                "trust_indicator_score": 94,
                "design_quality_rating": "Excellent",
                "observations": [
                    "Clean minimalism with strong visual focus on footwear imagery.",
                    "Primary hero CTA button 'Shop Men' has strong contrast against white background.",
                    "Certified B Corp badge positioned above footer provides strong sustainability credibility."
                ]
            },
            "analysis": {
                "business_summary": "Allbirds is a globally recognized sustainable footwear and apparel brand emphasizing natural merino wool and eucalyptus tree fiber materials.",
                "target_audience": "Eco-conscious urban professionals aged 24-50 seeking ergonomic design.",
                "business_model": "Direct-to-Consumer & Omnichannel Retail.",
                "value_proposition": "World's most comfortable shoes made naturally.",
                "brand_voice": "Friendly, sustainable, transparent, and direct.",
                "weak_messaging": ["Product sizing guidance is buried 2 levels deep."],
                "trust_issues": ["Review star rating breakdown is hidden inside accordion."],
                "missing_ctas": ["Missing sticky mobile checkout bar."],
                "seo_observations": ["Good meta tags; opportunity for schema markup expansion."]
            },
            "friction_points": [
                {
                    "id": "fp-demo-1",
                    "category": "UX & Checkout",
                    "severity": "medium",
                    "title": "Size Selection Friction on Mobile",
                    "description": "Users must scroll to view half-size inventory availability.",
                    "location": "Product Viewport",
                    "impact": "Estimated -6.5% conversion drop in mobile cart additions.",
                    "recommended_fix": "Add inline 'Fits True to Size' helper modal next to size selector grid."
                }
            ],
            "recommendations": [
                "Implement sticky buy bar on mobile viewports.",
                "Highlight 30-day money-back trial directly next to cart checkout button."
            ],
            "revenue_opportunity": {
                "current_conversion_rate": 2.2,
                "estimated_monthly_traffic": 450000,
                "average_order_value": 110.0,
                "target_conversion_rate": 2.9,
                "monthly_revenue_lift": 34650.0,
                "annual_revenue_lift": 415800.0
            },
            "competitors": [
                {
                    "name": "Giesswein",
                    "url": "https://giesswein.com",
                    "ux_score": 82,
                    "load_speed_seconds": 1.6,
                    "pricing_model": "Direct Purchase",
                    "strengths": ["Wool expertise messaging"],
                    "weaknesses": ["Cluttered checkout"]
                }
            ]
        }
        db_store.save_audit(sample_audit)
        db_store.save_crm_lead({
            "id": "lead-demo101",
            "company_name": "Allbirds",
            "domain": "allbirds.com",
            "url": "https://allbirds.com",
            "audit_id": seed_id,
            "contact_name": "Growth Director",
            "contact_email": "growth@allbirds.com",
            "status": "Contacted",
            "owner": "Growth Team",
            "estimated_arr_lift": 415800.0,
            "notes": "E-Commerce Audit completed. Teardown email sent.",
            "tags": ["Sustainable", "Footwear", "Tier 1 Lead"],
            "follow_up_date": "2026-08-01",
            "last_contacted": "2026-07-27",
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        })
