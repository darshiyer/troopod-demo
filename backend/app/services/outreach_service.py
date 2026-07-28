from app.schemas.outreach import OutreachCampaignResponse, OutreachAsset, OutreachCampaignRequest
from app.db.store import db_store

class OutreachService:
    @staticmethod
    def generate_campaign(req: OutreachCampaignRequest) -> OutreachCampaignResponse:
        audit = db_store.get_audit(req.audit_id)
        if not audit:
            domain = "company.com"
            company_name = "Company"
            annual_lift = "$124,500"
            conversion_score = 68
        else:
            domain = audit["domain"]
            company_name = audit["company_name"]
            annual_lift = f"${audit['revenue_opportunity']['annual_revenue_lift']:,.0f}"
            conversion_score = audit["conversion_score"]

        cold_email = OutreachAsset(
            id="asset-email-1",
            channel="cold_email",
            title="Cold Email - High Conversion Teardown",
            subject_line=f"Quick CRO feedback on {domain} (Unlocking +{annual_lift}/yr)",
            body_content=f"""Hi {{FirstName}},

I was browsing {domain} earlier today and noticed 2 subtle CRO friction points in your mobile checkout flow that are likely costing you ~14% in lost sessions.

Specifically:
1. Your primary CTA button drops below the fold on mobile viewports (<390px).
2. Your 5-star review social proof is separated from your order button by 2 full page scrolls.

We ran a quick Growth Audit on {domain} using Troopod Agency Engine and calculated an estimated +{annual_lift}/year in incremental revenue lift by implementing 4 high-impact fixes.

Would you be open to seeing the 2-minute video teardown and PDF report? No pitch — just actionable takeaways.

Best,
Growth Team Lead""",
            target_role="VP of Growth / Founder",
            tone=req.tone_preference or "consultative"
        )

        linkedin_msg = OutreachAsset(
            id="asset-linkedin-1",
            channel="linkedin_inmail",
            title="LinkedIn InMail Teardown Intro",
            subject_line=f"Audit teardown for {company_name}",
            body_content=f"""Hey {{FirstName}}, impressed by what you're building at {company_name}! 

Our team ran an AI CRO audit on {domain} and surfaced a few quick-win optimizations for your mobile conversion rate. 

We mapped out how a minor tweak to your mobile CTA position + mini-cart free shipping indicator could unlock +{annual_lift} in ARR.

Mind if I drop the 1-page PDF summary over here?""",
            target_role="Head of E-Commerce",
            tone="direct"
        )

        twitter_dm = OutreachAsset(
            id="asset-twitter-1",
            channel="twitter_dm",
            title="Twitter / X Direct Message",
            subject_line=None,
            body_content=f"""Hey {{FirstName}}! Quick heads up — just audited {domain}'s landing page UX. Loved the product design, but spotted 2 hidden friction points in your mobile cart drawer. Built a quick PDF report showing how to fix them for a quick conversion boost. Let me know if you want the link! 🚀""",
            target_role="Founder / CMO",
            tone="casual"
        )

        follow_up = OutreachAsset(
            id="asset-followup-1",
            channel="follow_up_email",
            title="Follow-Up Email (Bump with Wireframe)",
            subject_line=f"Re: Quick CRO feedback on {domain}",
            body_content=f"""Hi {{FirstName}},

Following up on my previous note regarding {domain}.

I put together an interactive wireframe redesign showing your hero section optimized for high-intent mobile visitors (Score: {conversion_score}/100 -> 92/100).

Here is the direct link to view your custom audit dashboard: {{AuditLink}}

Let me know what you think!""",
            target_role="VP of Growth",
            tone="consultative"
        )

        founder_intro = OutreachAsset(
            id="asset-founder-1",
            channel="founder_intro",
            title="Founder-to-Founder Intro Script",
            subject_line=f"Growth strategy benchmark for {company_name}",
            body_content=f"""Hi {{FirstName}},

As a fellow founder in the e-commerce space, I know how hard it is to scale ad spend when landing page conversion rates hit a plateau.

We benchmarked {domain} against 3 top category competitors. You're outperforming on page speed, but lagging behind on trust badge placement and cart threshold upsells.

If you're open to a 10-minute peer chat, I'd love to share the exact teardown data we compiled.

Cheers,""",
            target_role="CEO / Co-Founder",
            tone="high_urgency"
        )

        sales_proposal = OutreachAsset(
            id="asset-proposal-1",
            channel="sales_proposal",
            title="Executive Growth Sprint Proposal Brief",
            subject_line=f"Troopod Agency Sprint Proposal — {company_name}",
            body_content=f"""EXECUTIVE SUMMARY & PROPOSAL BRIEF

Target Account: {company_name} ({domain})
Baseline Conversion Score: {conversion_score}/100
Projected Revenue Lift: +{annual_lift}/year

PROPOSED SPRINT DELIVERABLES:
1. Mobile Checkout & Mini-Cart Overhaul (Sticky CTA & Free Shipping Bar)
2. High-Converting Hero Copy & Headline A/B Test Suite
3. Trust Badge & Review Widget Integration at Checkout Anchor
4. Full PageSpeed & Core Web Vitals Optimization (LCP < 1.8s)

GUARANTEE & TIMELINE:
- 14-Day Delivery
- Performance SLA: Minimum +0.5% Conversion Rate Lift Guarantee""",
            target_role="Executive Board / CMO",
            tone="consultative"
        )

        return OutreachCampaignResponse(
            audit_id=req.audit_id,
            company_name=company_name,
            domain=domain,
            cold_email=cold_email,
            linkedin_message=linkedin_msg,
            twitter_dm=twitter_dm,
            follow_up_email=follow_up,
            founder_intro=founder_intro,
            sales_proposal=sales_proposal
        )
