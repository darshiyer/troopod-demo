import pytest
from app.indexer.hybrid_search import reciprocal_rank_fusion, calculate_temporal_decay

def test_temporal_decay_recent():
    from datetime import datetime, timezone, timedelta
    now = datetime.now(timezone.utc)
    recent = (now - timedelta(minutes=5)).isoformat()
    decay = calculate_temporal_decay(recent)
    assert decay > 0.95

def test_rrf_fusion_sorting():
    vec_results = [
        {"id": "v1", "title": "Vector Doc 1", "score": 0.95, "source": "code", "timestamp": "2026-07-25T00:00:00Z"}
    ]
    fts_results = [
        {"id": "f1", "title": "FTS Doc 1", "score": 0.90, "source": "notes", "timestamp": "2026-07-25T00:00:00Z"}
    ]
    fused = reciprocal_rank_fusion(vec_results, fts_results, top_n=5)
    assert len(fused) == 2
    assert fused[0].score >= fused[1].score
