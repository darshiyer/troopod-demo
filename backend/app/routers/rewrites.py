from fastapi import APIRouter
from app.schemas.rewrite import (
    LandingPageRewriteResponse, HeadlineRewrite, CTARewrite,
    PricingSuggestion, HeroSectionRedesign, TestimonialFraming, SEOImprovement
)
from app.db.store import db_store

router = APIRouter(prefix="/rewrites", tags=["Landing Page AI Rewriter"])

@router.post("/landing-page", response_model=LandingPageRewriteResponse)
def rewrite_landing_page(audit_id: str):
    audit = db_store.get_audit(audit_id)
    if audit:
        company_name = audit["company_name"]
        orig_headline = audit["extracted_elements"]["headlines"][0] if audit["extracted_elements"]["headlines"] else "Premium Products"
        orig_cta = audit["extracted_elements"]["ctas"][0] if audit["extracted_elements"]["ctas"] else "Shop Now"
    else:
        company_name = "Target Brand"
        orig_headline = "Transform Your Routine Today"
        orig_cta = "Buy Now"

    return LandingPageRewriteResponse(
        audit_id=audit_id,
        company_name=company_name,
        headlines=[
            HeadlineRewrite(
                original=orig_headline,
                variation_1=f"Experience 2x Faster Results with {company_name} — Backed by 10,000+ 5-Star Reviews",
                variation_2=f"The #1 Preferred Choice for High Performance — Risk-Free 30 Day Trial",
                variation_3=f"Upgrade Your Everyday Setup with {company_name} | Guaranteed Results",
                rationale="Replaces passive feature headline with high-intent emotional transformation and immediate social proof.",
                predicted_conversion_lift="+18.4% CTR"
            ),
            HeadlineRewrite(
                original="Quality Gear Built to Last",
                variation_1="Engineered with Military-Grade Materials for Lifetime Durability",
                variation_2="Never Replace Your Setup Again — Designed for Peak Endurance",
                variation_3="Trusted by 50,000+ Professionals Nationwide",
                rationale="Highlights loss-aversion and durability guarantees.",
                predicted_conversion_lift="+12.1% CTR"
            )
        ],
        ctas=[
            CTARewrite(
                original=orig_cta,
                improved_cta="Claim Your 20% Off Bundle & Free Shipping →",
                subtext_friction_reducer="🔒 30-Day Money Back Guarantee • No Questions Asked",
                placement_recommendation="Position as primary hero button with micro-copy reassurance subtext directly below."
            ),
            CTARewrite(
                original="Add to Cart",
                improved_cta="Unlock Fast 2-Day Delivery",
                subtext_friction_reducer="⚡ Ships within 24 hours from US Warehouse",
                placement_recommendation="Use as secondary CTA in product drawer."
            )
        ],
        pricing_suggestions=[
            PricingSuggestion(
                tier_name="Single Purchase vs Subscription",
                suggested_structure="Default select 'Subscribe & Save 15%' with flexible delivery intervals (30/60/90 days).",
                value_anchoring_tip="Display MSRP strike-through next to bundle price ($120 $89).",
                trust_element="Easy 1-click cancellation in customer portal."
            ),
            PricingSuggestion(
                tier_name="Free Shipping Threshold",
                suggested_structure="Set free shipping threshold 20% above Average Order Value ($75 threshold for $60 AOV).",
                value_anchoring_tip="Add visual progress bar in cart drawer.",
                trust_element="Carbon-neutral carbon offset badge."
            )
        ],
        hero_redesign=HeroSectionRedesign(
            headline=f"Transform Your Setup with {company_name}",
            subheadline="Join over 50,000+ happy customers who upgraded their daily workflow with premium quality.",
            primary_cta="Get Started - Save 20% Today",
            secondary_cta="Watch 60-Second Demo",
            social_proof_bar="★★★★★ 4.9/5 Average Rating (3,400+ Verified Buyers)"
        ),
        faq_section=[
            {
                "question": "How long does shipping take?",
                "answer": "All standard US orders ship within 24 hours and arrive within 2-4 business days."
            },
            {
                "question": "What is your return policy?",
                "answer": "We offer a 30-day money-back guarantee with zero hassle. If you're not satisfied, return it for a 100% refund."
            },
            {
                "question": "Is checkout secure?",
                "answer": "Yes, all transactions are encrypted using bank-grade 256-bit SSL encryption."
            }
        ],
        testimonials=[
            TestimonialFraming(
                quote="I was skeptical at first, but within 3 days of receiving my package, I noticed an immediate improvement.",
                customer_profile="Verified Buyer • San Francisco, CA",
                result_highlight="Saved 5+ hours per week"
            )
        ],
        seo_improvements=SEOImprovement(
            meta_title=f"{company_name} | Official Store - Premium Quality & Fast Shipping",
            meta_description=f"Discover top-rated products at {company_name}. Enjoy free shipping on orders over $50 and a 30-day money back guarantee.",
            target_keywords=[f"buy {company_name.lower()}", f"{company_name.lower()} reviews", "best ecommerce deals"],
            schema_type="Product, Organization, AggregateRating"
        )
    )
