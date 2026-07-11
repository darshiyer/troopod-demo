import os
from pathlib import Path
HOME_DIR = Path.home()
DB_DIR = HOME_DIR / ".omnibrain"
LANCE_DB_PATH = DB_DIR / "lancedb"
FTS_DB_PATH = DB_DIR / "fts.db"
EMBEDDING_MODEL = "nomic-embed-text"
VECTOR_DIMENSION = 768
os.makedirs(DB_DIR, exist_ok=True)

# Commit update 69
