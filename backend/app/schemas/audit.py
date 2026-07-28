from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class PageMetadata(BaseModel):
    title: str
    description: str
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    canonical_url: Optional[str] = None
    robots: Optional[str] = None
    has_sitemap: bool = False
    has_schema_markup: bool = False

class ExtractedElements(BaseModel):
    headlines: List[str] = []
    ctas: List[str] = []
    testimonials: List[str] = []
    products: List[str] = []
    navigation_links: List[str] = []
    pricing_mentions: List[str] = []
    trust_badges: List[str] = []
    has_live_chat: bool = False
    has_popups: bool = False
    form_count: int = 0

class PageSpeedMetric(BaseModel):
    performance_score: int
    accessibility_score: int
    best_practices_score: int
    seo_score: int
    lcp_seconds: float
    inp_ms: int
    cls_score: float

class VisionAnalysis(BaseModel):
    visual_hierarchy_score: int
    cta_placement_score: int
    whitespace_score: int
    contrast_score: int
    button_visibility_score: int
    readability_score: int
    accessibility_score: int
    trust_indicator_score: int
    design_quality_rating: str  # Excellent, Good, Average, Needs Improvement
    observations: List[str] = []

class FrictionPoint(BaseModel):
    id: str
    category: str  # UX, Copy, Trust, Performance, Checkout
    severity: str  # high, medium, low
    title: str
    description: str
    location: str
    impact: str
    recommended_fix: str

class CompetitorBenchmark(BaseModel):
    name: str
    url: str
    ux_score: int
    load_speed_seconds: float
    pricing_model: str
    strengths: List[str] = []
    weaknesses: List[str] = []

class RevenueOpportunity(BaseModel):
    current_conversion_rate: float  # e.g. 1.8%
    estimated_monthly_traffic: int  # e.g. 50000
    average_order_value: float      # e.g. $85
    target_conversion_rate: float   # e.g. 2.9%
    monthly_revenue_lift: float
    annual_revenue_lift: float

class AIAnalysisSummary(BaseModel):
    business_summary: str
    target_audience: str
    business_model: str
    value_proposition: str
    brand_voice: str
    weak_messaging: List[str] = []
    trust_issues: List[str] = []
    missing_ctas: List[str] = []
    seo_observations: List[str] = []

class AuditRequest(BaseModel):
    url: str

class AuditResult(BaseModel):
    id: str
    url: str
    company_name: str
    domain: str
    created_at: datetime
    status: str  # pending, scanning, completed, failed
    progress_step: str  # e.g., "Evaluating CRO..."
    progress_percent: int
    
    metadata: PageMetadata
    extracted_elements: ExtractedElements
    pagespeed: PageSpeedMetric
    vision: VisionAnalysis
    analysis: AIAnalysisSummary
    
    conversion_score: int
    trust_score: int
    ux_score: int
    readability_score: int
    copy_score: int
    overall_growth_score: int
    
    friction_points: List[FrictionPoint] = []
    recommendations: List[str] = []
    revenue_opportunity: RevenueOpportunity
    competitors: List[CompetitorBenchmark] = []

class AuditSummaryItem(BaseModel):
    id: str
    url: str
    company_name: str
    domain: str
    created_at: datetime
    overall_growth_score: int
    conversion_score: int
    annual_revenue_lift: float
    status: str
