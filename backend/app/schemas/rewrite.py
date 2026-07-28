from typing import List, Optional
from pydantic import BaseModel

class HeadlineRewrite(BaseModel):
    original: str
    variation_1: str
    variation_2: str
    variation_3: str
    rationale: str
    predicted_conversion_lift: str

class CTARewrite(BaseModel):
    original: str
    improved_cta: str
    subtext_friction_reducer: str
    placement_recommendation: str

class PricingSuggestion(BaseModel):
    tier_name: str
    suggested_structure: str
    value_anchoring_tip: str
    trust_element: str

class HeroSectionRedesign(BaseModel):
    headline: str
    subheadline: str
    primary_cta: str
    secondary_cta: str
    social_proof_bar: str

class TestimonialFraming(BaseModel):
    quote: str
    customer_profile: str
    result_highlight: str

class SEOImprovement(BaseModel):
    meta_title: str
    meta_description: str
    target_keywords: List[str] = []
    schema_type: str

class LandingPageRewriteResponse(BaseModel):
    audit_id: str
    company_name: str
    headlines: List[HeadlineRewrite] = []
    ctas: List[CTARewrite] = []
    pricing_suggestions: List[PricingSuggestion] = []
    hero_redesign: HeroSectionRedesign
    faq_section: List[dict] = []
    testimonials: List[TestimonialFraming] = []
    seo_improvements: SEOImprovement
