"""
SecureCode AI (SOC-AI) — MongoDB Database Connector & GridFS
Developer: Yashi Goel
Implements asynchronous MongoDB integration via Motor:
- Dynamic polymorphic collections for Scans, Findings, Secrets, Dependencies, and Attack Paths
- GridFS for chunked source-code ZIP archive storage (> 16MB)
- TTL (Time-To-Live) index for automated 24-hour file cleanup (Section 13 Data Retention)
- Compound & Full-Text Search indexing on code snippets & vulnerability descriptions
"""

import os
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "securecode_ai")

client: Optional[AsyncIOMotorClient] = None
db = None
fs_bucket: Optional[AsyncIOMotorGridFSBucket] = None


def get_client() -> AsyncIOMotorClient:
    global client, db, fs_bucket
    if client is None:
        client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        db = client[DB_NAME]
        fs_bucket = AsyncIOMotorGridFSBucket(db)
    return client


def get_db():
    global db
    if db is None:
        get_client()
    return db


def get_gridfs() -> AsyncIOMotorGridFSBucket:
    global fs_bucket
    if fs_bucket is None:
        get_client()
    return fs_bucket


async def init_mongo_indexes():
    """Initializes performance, text search, and automated TTL indexes."""
    try:
        database = get_db()

        # 1. TTL Index: Automatically purge completed scans & uploaded source artifacts after 24 hours (86,400 seconds)
        # Complies with Section 13: "Avoid storing uploaded source code longer than necessary"
        await database.scans.create_index("completed_at", expireAfterSeconds=86400, name="scan_ttl_24h")

        # 2. Full-Text Search Index on Code Findings & Vulnerability Descriptions
        await database.findings.create_index(
            [
                ("code_snippet", "text"),
                ("title", "text"),
                ("description", "text"),
                ("cwe", "text")
            ],
            name="findings_fulltext_search"
        )

        # 3. Compound Indexes for fast dashboard filtering by Scan + Severity + Status
        await database.findings.create_index(
            [("scan_id", 1), ("severity", 1), ("status", 1)],
            name="findings_scan_severity_idx"
        )

        # 4. Project & Secret lookup indexes
        await database.projects.create_index("user_id", name="project_user_idx")
        await database.secrets.create_index("scan_id", name="secrets_scan_idx")
        await database.dependencies.create_index("scan_id", name="dependencies_scan_idx")
        await database.attack_paths.create_index("scan_id", name="attackpaths_scan_idx")

        print("[MongoDB] Indexes initialized successfully (TTL, Full-Text Search, Compound).")
    except Exception as e:
        print(f"[MongoDB Warning] Could not initialize indexes (is MongoDB running?): {e}")


def serialize_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Converts MongoDB BSON ObjectId to JSON-serializable string."""
    if doc is None:
        return None
    res = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            res[k] = str(v)
        elif isinstance(v, list):
            res[k] = [serialize_doc(item) if isinstance(item, dict) else item for item in v]
        elif isinstance(v, dict):
            res[k] = serialize_doc(v)
        else:
            res[k] = v
    if "_id" in res and "id" not in res:
        res["id"] = res["_id"]
    return res


def serialize_list(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [serialize_doc(d) for d in docs if d is not None]

