import sqlite3
import shutil
import tempfile
import os
import logging
from typing import List, Dict, Any
from datetime import datetime, timezone
from ..config import settings
from .base import BaseExtractor

logger = logging.getLogger("omnibrain.extractors.chrome")

class ChromeExtractor(BaseExtractor):
    """
    Safely extracts visited URLs, page titles, and timestamps from Chrome, Arc, and Safari SQLite databases.
    Uses tempfile copy to avoid database lock errors while browsers are open.
    """

    def get_source_type(self) -> str:
        return "chrome"

    @staticmethod
    def _chrome_time_to_datetime(chrome_time: int) -> datetime:
        """Converts Chrome Microseconds (since Jan 1, 1601) to ISO datetime."""
        if not chrome_time:
            return datetime.now(timezone.utc)
        try:
            timestamp_sec = (chrome_time / 1000000) - 11644473600
            return datetime.fromtimestamp(max(0, timestamp_sec), timezone.utc)
        except Exception:
            return datetime.now(timezone.utc)

    def extract(self) -> List[Dict[str, Any]]:
        target_path = settings.CHROME_HISTORY_PATH
        if not os.path.exists(target_path):
            target_path = settings.ARC_HISTORY_PATH

        if not os.path.exists(target_path):
            logger.warning("No Chrome/Arc history database found at specified paths.")
            return []

        temp_dir = tempfile.mkdtemp(prefix="omnibrain_chrome_")
        temp_db = os.path.join(temp_dir, "History")
        records = []

        try:
            shutil.copy2(target_path, temp_db)
            conn = sqlite3.connect(temp_db)
            cursor = conn.cursor()

            query = """
                SELECT urls.id, urls.url, urls.title, urls.visit_count, urls.last_visit_time
                FROM urls
                WHERE urls.title IS NOT NULL AND urls.title != '' AND urls.url LIKE 'http%'
                ORDER BY urls.last_visit_time DESC
                LIMIT 500
            """
            cursor.execute(query)
            rows = cursor.fetchall()

            for row in rows:
                url_id, url, title, visit_count, last_visit = row
                dt = self._chrome_time_to_datetime(last_visit)
                records.append({
                    "id": f"chrome_{url_id}",
                    "title": title.strip(),
                    "url": url,
                    "snippet": f"Visited page '{title.strip()}' ({visit_count} times) at {url}",
                    "source": "chrome",
                    "timestamp": dt.isoformat(),
                    "metadata": {"visit_count": visit_count, "domain": url.split("/")[2] if "//" in url else ""}
                })

            conn.close()
        except Exception as e:
            logger.error(f"Error reading Chrome history: {e}")
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

        return records
