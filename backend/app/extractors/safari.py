import sqlite3
import shutil
import tempfile
import os
import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from ..config import settings
from .base import BaseExtractor

logger = logging.getLogger("omnibrain.extractors.safari")

class SafariExtractor(BaseExtractor):
    """
    Safely extracts visited URLs, page titles, and timestamps from macOS Safari History.db.
    Uses tempfile copy to avoid database locks while Safari is running.
    """

    def get_source_type(self) -> str:
        return "safari"

    def extract(self) -> List[Dict[str, Any]]:
        target_path = settings.SAFARI_HISTORY_PATH
        if not os.path.exists(target_path):
            return []

        temp_dir = tempfile.mkdtemp(prefix="omnibrain_safari_")
        temp_db = os.path.join(temp_dir, "History.db")
        records = []

        try:
            shutil.copy2(target_path, temp_db)
            conn = sqlite3.connect(temp_db)
            cursor = conn.cursor()

            query = """
                SELECT history_items.id, history_items.url, history_visits.title, history_visits.visit_time
                FROM history_items
                JOIN history_visits ON history_items.id = history_visits.history_item
                WHERE history_visits.title IS NOT NULL AND history_visits.title != ''
                ORDER BY history_visits.visit_time DESC
                LIMIT 300
            """
            cursor.execute(query)
            for row in cursor.fetchall():
                item_id, url, title, visit_time = row
                # Safari time is seconds since 2001-01-01
                timestamp_sec = visit_time + 978307200
                dt = datetime.fromtimestamp(max(0, timestamp_sec), timezone.utc).isoformat()

                records.append({
                    "id": f"safari_{item_id}",
                    "title": title.strip(),
                    "url": url,
                    "snippet": f"Visited Safari page '{title.strip()}' at {url}",
                    "source": "safari",
                    "timestamp": dt,
                    "metadata": {"domain": url.split("/")[2] if "//" in url else ""}
                })
            conn.close()
        except Exception as e:
            logger.error(f"Error reading Safari history: {e}")
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

        return records
