import os
import json
from typing import Dict, List, Optional
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), "storage_dump.json")

class DataStore:
    def __init__(self):
        self.audits: Dict[str, dict] = {}
        self.crm_leads: Dict[str, dict] = {}
        self._load()

    def _load(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r") as f:
                    data = json.load(f)
                    self.audits = data.get("audits", {})
                    self.crm_leads = data.get("crm_leads", {})
            except Exception as e:
                print(f"Error loading store: {e}")
                self.audits = {}
                self.crm_leads = {}

    def _save(self):
        try:
            with open(DATA_FILE, "w") as f:
                json.dump({
                    "audits": self.audits,
                    "crm_leads": self.crm_leads
                }, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving store: {e}")

    # Audit operations
    def save_audit(self, audit_dict: dict):
        self.audits[audit_dict["id"]] = audit_dict
        self._save()

    def get_audit(self, audit_id: str) -> Optional[dict]:
        return self.audits.get(audit_id)

    def list_audits((self)) -> List[dict]:
        return sorted(list(self.audits.values()), key=lambda x: x.get("created_at", ""), reverse=True)

    def delete_audit(self, audit_id: str) -> bool:
        if audit_id in self.audits:
            del self.audits[audit_id]
            self._save()
            return True
        return False

    # CRM operations
    def save_crm_lead(self, lead_dict: dict):
        self.crm_leads[lead_dict["id"]] = lead_dict
        self._save()

    def get_crm_lead(self, lead_id: str) -> Optional[dict]:
        return self.crm_leads.get(lead_id)

    def list_crm_leads(self) -> List[dict]:
        return sorted(list(self.crm_leads.values()), key=lambda x: x.get("updated_at", ""), reverse=True)

    def delete_crm_lead(self, lead_id: str) -> bool:
        if lead_id in self.crm_leads:
            del self.crm_leads[lead_id]
            self._save()
            return True
        return False

db_store = DataStore()
