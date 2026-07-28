const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface PageSpeedMetric {
  performance_score: number;
  accessibility_score: number;
  best_practices_score: number;
  seo_score: number;
  lcp_seconds: number;
  inp_ms: number;
  cls_score: number;
}

export interface VisionAnalysis {
  visual_hierarchy_score: number;
  cta_placement_score: number;
  whitespace_score: number;
  contrast_score: number;
  button_visibility_score: number;
  readability_score: number;
  accessibility_score: number;
  trust_indicator_score: number;
  design_quality_rating: string;
  observations: string[];
}

export interface FrictionPoint {
  id: string;
  category: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  location: string;
  impact: string;
  recommended_fix: string;
}

export interface CompetitorBenchmark {
  name: string;
  url: string;
  ux_score: number;
  load_speed_seconds: number;
  pricing_model: string;
  strengths: string[];
  weaknesses: string[];
}

export interface RevenueOpportunity {
  current_conversion_rate: number;
  estimated_monthly_traffic: number;
  average_order_value: number;
  target_conversion_rate: number;
  monthly_revenue_lift: number;
  annual_revenue_lift: number;
}

export interface AuditResult {
  id: string;
  url: string;
  company_name: string;
  domain: string;
  created_at: string;
  status: string;
  progress_step: string;
  progress_percent: number;
  metadata: {
    title: string;
    description: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical_url?: string;
    robots?: string;
    has_sitemap: boolean;
    has_schema_markup: boolean;
  };
  extracted_elements: {
    headlines: string[];
    ctas: string[];
    testimonials: string[];
    products: string[];
    navigation_links: string[];
    pricing_mentions: string[];
    trust_badges: string[];
    has_live_chat: boolean;
    has_popups: boolean;
    form_count: number;
  };
  pagespeed: PageSpeedMetric;
  vision: VisionAnalysis;
  analysis: {
    business_summary: string;
    target_audience: string;
    business_model: string;
    value_proposition: string;
    brand_voice: string;
    weak_messaging: string[];
    trust_issues: string[];
    missing_ctas: string[];
    seo_observations: string[];
  };
  conversion_score: number;
  trust_score: number;
  ux_score: number;
  readability_score: number;
  copy_score: number;
  overall_growth_score: number;
  friction_points: FrictionPoint[];
  recommendations: string[];
  revenue_opportunity: RevenueOpportunity;
  competitors: CompetitorBenchmark[];
}

export interface CRMLead {
  id: string;
  company_name: string;
  domain: string;
  url: string;
  audit_id?: string;
  contact_name?: string;
  contact_email?: string;
  status: "New" | "Contacted" | "Demo Scheduled" | "Proposal Sent" | "Closed Won" | "Closed Lost";
  owner: string;
  estimated_arr_lift: number;
  notes?: string;
  tags: string[];
  follow_up_date?: string;
  last_contacted?: string;
  created_at: string;
  updated_at: string;
}

export interface OutreachAsset {
  id: string;
  channel: string;
  title: string;
  subject_line?: string;
  body_content: string;
  target_role: string;
  tone: string;
}

export interface OutreachCampaign {
  audit_id: string;
  company_name: string;
  domain: string;
  cold_email: OutreachAsset;
  linkedin_message: OutreachAsset;
  twitter_dm: OutreachAsset;
  follow_up_email: OutreachAsset;
  founder_intro: OutreachAsset;
  sales_proposal: OutreachAsset;
}

export interface LandingPageRewrite {
  audit_id: string;
  company_name: string;
  headlines: Array<{
    original: string;
    variation_1: string;
    variation_2: string;
    variation_3: string;
    rationale: string;
    predicted_conversion_lift: string;
  }>;
  ctas: Array<{
    original: string;
    improved_cta: string;
    subtext_friction_reducer: string;
    placement_recommendation: string;
  }>;
  pricing_suggestions: Array<{
    tier_name: string;
    suggested_structure: string;
    value_anchoring_tip: string;
    trust_element: string;
  }>;
  hero_redesign: {
    headline: string;
    subheadline: string;
    primary_cta: string;
    secondary_cta: string;
    social_proof_bar: string;
  };
  faq_section: Array<{ question: string; answer: string }>;
  testimonials: Array<{ quote: string; customer_profile: string; result_highlight: string }>;
  seo_improvements: {
    meta_title: string;
    meta_description: string;
    target_keywords: string[];
    schema_type: string;
  };
}

// API Functions
export async function startAuditScan(url: string): Promise<AuditResult> {
  const res = await fetch(`${API_BASE_URL}/audits/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to launch website audit.");
  }
  return res.json();
}

export async function fetchAuditsList(): Promise<AuditResult[]> {
  const res = await fetch(`${API_BASE_URL}/audits`);
  if (!res.ok) throw new Error("Failed to fetch audits");
  return res.json();
}

export async function fetchAuditById(id: string): Promise<AuditResult> {
  const res = await fetch(`${API_BASE_URL}/audits/${id}`);
  if (!res.ok) throw new Error("Audit not found");
  return res.json();
}

export async function fetchCRMLeads(): Promise<CRMLead[]> {
  const res = await fetch(`${API_BASE_URL}/crm`);
  if (!res.ok) throw new Error("Failed to fetch CRM leads");
  return res.json();
}

export async function updateCRMLead(id: string, updates: Partial<CRMLead>): Promise<CRMLead> {
  const res = await fetch(`${API_BASE_URL}/crm/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return res.json();
}

export async function generateOutreachCampaign(auditId: string): Promise<OutreachCampaign> {
  const res = await fetch(`${API_BASE_URL}/outreach/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audit_id: auditId }),
  });
  if (!res.ok) throw new Error("Failed to generate outreach campaign");
  return res.json();
}

export async function generateLandingPageRewrite(auditId: string): Promise<LandingPageRewrite> {
  const res = await fetch(`${API_BASE_URL}/rewrites/landing-page?audit_id=${auditId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to generate rewrite");
  return res.json();
}

export function getPDFReportUrl(auditId: string): string {
  return `${API_BASE_URL}/reports/pdf/${auditId}`;
}

export function getCSVExportUrl(): string {
  return `${API_BASE_URL}/export/csv`;
}
