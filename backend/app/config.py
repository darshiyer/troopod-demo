import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "OmniBrain AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Path Configurations
    HOME_DIR: Path = Path.home()
    DB_DIR: Path = HOME_DIR / ".omnibrain"
    LANCE_DB_PATH: Path = DB_DIR / "lancedb"
    FTS_DB_PATH: Path = DB_DIR / "fts.db"

    # Data Source Locations
    CHROME_HISTORY_PATH: Path = HOME_DIR / "Library/Application Support/Google/Chrome/Default/History"
    SAFARI_HISTORY_PATH: Path = HOME_DIR / "Library/Safari/History.db"
    ARC_HISTORY_PATH: Path = HOME_DIR / "Library/Application Support/Arc/User Data/Default/History"
    OBSIDIAN_VAULT_PATH: Path = HOME_DIR / "Documents/Obsidian"
    ZSH_HISTORY_PATH: Path = HOME_DIR / ".zsh_history"

    # AI & Retrieval Settings
    EMBEDDING_MODEL: str = "nomic-embed-text"
    VECTOR_DIMENSION: int = 768
    DEFAULT_TOP_K: int = 15
    RRF_K_PARAM: int = 60
    MAX_MEMORY_MB: int = 120

    class Config:
        env_prefix = "OMNIBRAIN_"

settings = Settings()
os.makedirs(settings.DB_DIR, exist_ok=True)
