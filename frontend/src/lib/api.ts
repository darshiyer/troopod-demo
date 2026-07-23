export interface SearchResult {
  id: string;
  title: string;
  source: 'chrome' | 'safari' | 'arc' | 'notes' | 'terminal' | 'code' | 'pdf';
  url?: string;
  path?: string;
  snippet: string;
  score: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TimelineItem {
  id: string;
  hour: string;
  title: string;
  source: 'chrome' | 'notes' | 'terminal' | 'code';
  detail: string;
  timestamp: string;
}

export interface GraphData {
  nodes: { id: string; label: string; group: string; val: number }[];
  edges: { source: string; target: string; relationship: string; weight: number }[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function searchMemory(query: string, source?: string): Promise<{ results: SearchResult[]; latencyMs: number }> {
  try {
    const url = new URL(`${BACKEND_URL}/api/search`);
    url.searchParams.append('query', query);
    if (source && source !== 'all') url.searchParams.append('source', source);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return { results: data.results, latencyMs: data.latency_ms };
    }
  } catch (err) {
    console.warn('Backend unavailable, using simulated local Mac memory:', err);
  }

  // High-fidelity Mock Fallback for Live Vercel Demo
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'mBART-50 Legal Translation Architecture',
      source: 'code',
      url: 'https://github.com/darshiyer/OmniBrain',
      path: 'backend/app/indexer/hybrid_search.py',
      snippet: 'Engineered Marathi-Kannada legal translation pipeline using mBART-50 and IndicTrans2 transformers (+25% BLEU improvement).',
      score: 0.96,
      timestamp: '2026-07-22T14:00:00Z',
      metadata: { repo: 'darshiyer/OmniBrain', framework: 'PyTorch' }
    },
    {
      id: '2',
      title: 'Model Context Protocol (MCP) Tool Integration',
      source: 'code',
      path: 'backend/app/mcp_server.py',
      snippet: 'Exposing 7 native MacBook memory tools directly into Cursor, Claude Desktop, and VS Code via Model Context Protocol (MCP).',
      score: 0.91,
      timestamp: '2026-07-23T10:15:00Z',
      metadata: { standard: 'MCP', provider: 'Anthropic' }
    },
    {
      id: '3',
      title: 'LanceDB Memory-Mapped Vector Latency Notes',
      source: 'notes',
      path: '~/Documents/Obsidian/Vector_Storage.md',
      snippet: 'Sub-50ms hybrid search using LanceDB memory-mapped vector tables with nomic-embed-text ONNX model under 100MB RAM.',
      score: 0.88,
      timestamp: '2026-07-21T18:30:00Z',
      metadata: { vault: 'Research', format: 'markdown' }
    },
    {
      id: '4',
      title: 'PyTorch Transformer Quantization & CUDA Graphs',
      source: 'chrome',
      url: 'https://pytorch.org/docs/stable/nn.html',
      snippet: 'Researched low-bit integer quantization (INT8/INT4) for low-resource Indian language translation backbones.',
      score: 0.84,
      timestamp: '2026-07-20T11:45:00Z',
      metadata: { browser: 'Chrome', visits: 14 }
    }
  ];

  const filtered = source && source !== 'all' 
    ? mockResults.filter(r => r.source === source) 
    : mockResults;

  return { results: filtered, latencyMs: 24.5 };
}

export async function fetchDailyTimeline(): Promise<TimelineItem[]> {
  return [
    {
      id: 't1',
      hour: '09:30 AM',
      title: 'Researched Model Context Protocol (MCP) Standards',
      source: 'chrome',
      detail: 'Visited modelcontextprotocol.io specification & Anthropic docs',
      timestamp: '2026-07-23T04:00:00Z'
    },
    {
      id: 't2',
      hour: '11:15 AM',
      title: 'Implemented Reciprocal Rank Fusion (RRF) Reranker',
      source: 'code',
      detail: 'Added exponential temporal decay scoring in hybrid_search.py',
      timestamp: '2026-07-23T05:45:00Z'
    },
    {
      id: 't3',
      hour: '02:45 PM',
      title: 'Saved Notes on Memory-Mapped Vector Retrieval',
      source: 'notes',
      detail: 'Documented zero-overhead ONNX embeddings in Obsidian vault',
      timestamp: '2026-07-23T09:15:00Z'
    },
    {
      id: 't4',
      hour: '05:20 PM',
      title: 'Ran Local FastAPI Benchmark Tests',
      source: 'terminal',
      detail: 'Executed uvicorn app.main:app --port 8000 (24ms p95 latency)',
      timestamp: '2026-07-23T11:50:00Z'
    }
  ];
}
