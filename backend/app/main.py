import time
import logging
from typing import List, Optional
from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .schemas import (
    SearchResponse, SearchResultItem, SourceType,
    TimelineEvent, GraphResponse, GraphNode, GraphEdge,
    MCPToolRequest, MCPToolResponse
)
from .indexer.hybrid_search import reciprocal_rank_fusion
from .mcp_server import ModelContextProtocolServer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("omnibrain.main")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Lightweight, Privacy-First macOS Second Brain Engine exposing Sub-50ms Hybrid RAG and native MCP tools."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mcp_server = ModelContextProtocolServer()

@app.get("/", tags=["System"])
async def root():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "macOS_supported": True,
        "features": ["Hybrid RAG", "LanceDB Vector Storage", "SQLite FTS5", "MCP Server"]
    }

@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "memory_mapped_db": str(settings.LANCE_DB_PATH),
        "fts_db": str(settings.FTS_DB_PATH)
    }

@app.get("/api/search", response_model=SearchResponse, tags=["Search Engine"])
async def search_memory(
    query: str = Query(..., min_length=1, description="Natural language search query"),
    limit: int = Query(default=10, ge=1, le=50),
    source: Optional[SourceType] = None
):
    start_time = time.perf_counter()
    logger.info(f"Received search query: '{query}' [source={source}]")

    # Sample hybrid search integration (RRF Reranking)
    raw_vector_results = [
        {
            "id": "1",
            "title": "mBART-50 Legal Translation Architecture",
            "source": "code",
            "url": "https://github.com/darshiyer/OmniBrain",
            "snippet": "Engineered Marathi-Kannada legal translation pipeline with mBART-50 improving BLEU by 25%.",
            "timestamp": "2026-07-22T14:00:00Z",
            "metadata": {"repo": "darshiyer/OmniBrain", "commit": "ead7485"}
        },
        {
            "id": "2",
            "title": "FastEmbed ONNX Vector Latency Benchmarks",
            "source": "notes",
            "path": "~/Documents/Obsidian/FastEmbed_Bench.md",
            "snippet": "Memory-mapped LanceDB vector lookups executing under 24ms with zero PyTorch RAM overhead.",
            "timestamp": "2026-07-21T18:30:00Z",
            "metadata": {"tags": ["onnx", "lancedb", "benchmark"]}
        }
    ]

    raw_fts_results = [
        {
            "id": "3",
            "title": "FastAPI Async Stream & SSE Middleware",
            "source": "code",
            "path": "backend/app/main.py",
            "snippet": "async def stream_response(): yield ServerSentEvents for real-time AI token generation.",
            "timestamp": "2026-07-23T10:15:00Z",
            "metadata": {"framework": "FastAPI"}
        }
    ]

    fused_results = reciprocal_rank_fusion(raw_vector_results, raw_fts_results, top_n=limit)
    
    if source:
        fused_results = [r for r in fused_results if r.source == source]

    latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

    return SearchResponse(
        query=query,
        total_results=len(fused_results),
        latency_ms=latency_ms,
        results=fused_results
    )

@app.get("/api/timeline", response_model=List[TimelineEvent], tags=["Timeline Digest"])
async def get_daily_timeline():
    return [
        TimelineEvent(
            id="t1",
            hour="09:30 AM",
            title="Researched Model Context Protocol (MCP) Standards",
            source=SourceType.CHROME,
            detail="Visited modelcontextprotocol.io specification docs",
            timestamp="2026-07-23T04:00:00Z"
        ),
        TimelineEvent(
            id="t2",
            hour="11:15 AM",
            title="Modified RAG Hybrid Search Reranking Algorithm",
            source=SourceType.CODE,
            detail="Added Reciprocal Rank Fusion (RRF) with exponential temporal decay",
            timestamp="2026-07-23T05:45:00Z"
        ),
        TimelineEvent(
            id="t3",
            hour="02:45 PM",
            title="Saved Notes on LanceDB Memory-Mapped Storage",
            source=SourceType.NOTES,
            detail="Documented disk mmap vector retrieval strategies in Obsidian vault",
            timestamp="2026-07-23T09:15:00Z"
        )
    ]

@app.get("/api/graph", response_model=GraphResponse, tags=["Knowledge Graph"])
async def get_knowledge_graph():
    return GraphResponse(
        nodes=[
            GraphNode(id="n1", label="OmniBrain Core", group=SourceType.CODE, val=3),
            GraphNode(id="n2", label="Model Context Protocol", group=SourceType.CODE, val=2),
            GraphNode(id="n3", label="LanceDB Vector Store", group=SourceType.NOTES, val=2),
            GraphNode(id="n4", label="FastAPI Stream API", group=SourceType.CHROME, val=1)
        ],
        edges=[
            GraphEdge(source="n1", target="n2", relationship="implements", weight=0.9),
            GraphEdge(source="n1", target="n3", relationship="queries", weight=0.85),
            GraphEdge(source="n2", target="n4", relationship="exposes", weight=0.75)
        ]
    )

@app.post("/api/mcp/invoke", response_model=MCPToolResponse, tags=["MCP Protocol"])
async def invoke_mcp_tool(request: MCPToolRequest):
    return mcp_server.handle_request(request)

@app.get("/api/mcp/tools", tags=["MCP Protocol"])
async def list_mcp_tools():
    return {"tools": mcp_server.list_tools()}
