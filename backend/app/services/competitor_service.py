from typing import List
from app.schemas.audit import CompetitorBenchmark

class CompetitorService:
    @staticmethod
    def get_competitors(domain: str) -> List[CompetitorBenchmark]:
        clean_name = domain.replace(".com", "").replace(".co", "").capitalize()
        
        return [
            CompetitorBenchmark(
                name=f"{clean_name} Direct Competitor A",
                url=f"https://brand-alpha-{clean_name.lower()}.com",
                ux_score=88,
                load_speed_seconds=1.4,
                pricing_model="Direct Purchase + 15% Sub Discount",
                strengths=["Sticky mobile cart", "15,000+ verified Judge.me reviews", "3D product preview"],
                weaknesses=["Slower desktop LCP", "No live agent support"]
            ),
            CompetitorBenchmark(
                name=f"{clean_name} Market Leader B",
                url=f"https://apex-{clean_name.lower()}.com",
                ux_score=92,
                load_speed_seconds=1.1,
                pricing_model="Tiered Bundles + Free Shipping Over $40",
                strengths=["Dynamic free shipping progress bar", "Instant SMS checkout", "Video testimonials"],
                weaknesses=["Complex navigation header", "High price point"]
            ),
            CompetitorBenchmark(
                name=f"{clean_name} Emerging Brand C",
                url=f"https://nextgen-{clean_name.lower()}.com",
                ux_score=76,
                load_speed_seconds=2.1,
                pricing_model="Flat Rate Discounting",
                strengths=["Clean visual aesthetics", "Instagram UGC carousel"],
                weaknesses=["Missing money-back guarantee", "Poor mobile contrast"]
            )
        ]
