from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="OmniBrain AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.get("/")
async def root(): return {"service": "OmniBrain Core", "status": "online"}

@app.get("/api/search")
async def search(q: str): return {"query": q, "latency_ms": 24, "results": []}

# Commit update 36
