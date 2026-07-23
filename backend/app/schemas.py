from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class SourceType(str, Enum):
    CHROME = "chrome"
    SAFARI = "safari"
    ARC = "arc"
    NOTES = "notes"
    TERMINAL = "terminal"
    CODE = "code"
    PDF = "pdf"

class SearchResultItem(BaseModel):
    id: str
    title: str
    source: SourceType
    url: Optional[str] = None
    path: Optional[str] = None
    snippet: str
    score: float = Field(..., ge=0.0, le=1.0)
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)

class SearchResponse(BaseModel):
    query: str
    total_results: int
    latency_ms: float
    results: List[SearchResultItem]

class TimelineEvent(BaseModel):
    id: str
    hour: str
    title: str
    source: SourceType
    detail: str
    timestamp: datetime

class GraphNode(BaseModel):
    id: str
    label: str
    group: SourceType
    val: int = 1

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    weight: float = 1.0

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class MCPToolRequest(BaseModel):
    name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)

class MCPToolResponse(BaseModel):
    tool_name: str
    success: bool
    data: Any
    error: Optional[str] = None
