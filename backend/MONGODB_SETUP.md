# MongoDB Architecture & Integration Guide — SOC-AI (SecureCode AI)
**Author:** Yashi Goel  
**Component:** Database & GridFS Binary Storage Subsystem  
**Backend:** FastAPI + Motor (Async Driver) + PyMongo

---

## 1. Why MongoDB for SOC-AI?

Security scanning platforms deal with **polymorphic, semi-structured, and hierarchical code data**:
* **Polymorphic Findings:** A SQL Injection finding needs `sink` and `codeSnippet`, while a Secret leak requires `masked_value` and `entropy_score`. Storing these in relational databases requires complex multi-table joins. In MongoDB, they are stored as native, flexible BSON documents.
* **Large ZIP Archive Storage (GridFS):** Uploaded source code archives up to 25MB are divided into 255KB chunks in `fs.chunks` and `fs.files`, eliminating third-party S3 dependencies.
* **Automated 24h Data Retention (TTL Index):** Fulfills Section 13 security compliance by automatically deleting temporary scan archives after 24 hours via `expireAfterSeconds=86400`.
* **Full-Text Code Search:** Native `$text` compound indexing allows instant querying across code snippets and CWE descriptions.

---

## 2. MongoDB Collections & Schemas

### `scans`
```json
{
  "_id": ObjectId("6644f1e8a93bc401b8e21a01"),
  "scan_id": "scan-9a8b1c",
  "project_name": "ecommerce-api-service",
  "status": "COMPLETED",
  "securityScore": 82,
  "gridfs_archive_id": "6644f1e8a93bc401b8e21a02",
  "started_at": "2026-11-16T10:00:00Z",
  "completed_at": ISODate("2026-11-16T10:00:45Z"),
  "mlPredictions": {
    "model_name": "Random Forest Classifier",
    "vulnerability_probability": 0.942,
    "anomaly_detection": {
      "model": "Isolation Forest",
      "anomaly_score": -0.68,
      "is_anomaly": true
    }
  }
}
```

### `findings`
```json
{
  "_id": ObjectId("6644f210a93bc401b8e21a03"),
  "scan_id": "scan-9a8b1c",
  "type": "SQL Injection",
  "severity": "CRITICAL",
  "cwe": "CWE-89",
  "line": 42,
  "code_snippet": "const query = 'SELECT * FROM users WHERE email = ' + req.body.email;",
  "sink": "database.query()",
  "status": "OPEN",
  "remediation": {
    "explanation": "Use parameterized queries with prepared statements.",
    "fixed_code": "const query = 'SELECT * FROM users WHERE email = ?';\nconst [rows] = await db.execute(query, [req.body.email]);"
  }
}
```

### `secrets`
```json
{
  "_id": ObjectId("6644f235a93bc401b8e21a04"),
  "scan_id": "scan-9a8b1c",
  "secret_type": "Stripe API Key (Test)",
  "severity": "CRITICAL",
  "file": "config/payment.js",
  "line": 14,
  "masked_value": "sk_test_••••••••••••••••demo",
  "entropy_score": 4.21
}
```

### `fs.files` & `fs.chunks` (GridFS)
* Automatically stores chunked binary streams for uploaded ZIP archives larger than 16MB.

---

## 3. Running with Docker Compose

To start MongoDB, Mongo Express (Web UI), and FastAPI:

```bash
cd backend
docker-compose up -d mongo mongo-express backend
```

* **FastAPI Backend:** [http://localhost:8000](http://localhost:8000)
* **Interactive API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Mongo Express GUI (Visual DB Explorer):** [http://localhost:8081](http://localhost:8081)

---

## 4. REST API Endpoints with MongoDB

* `GET /api/system/db-status` — Returns live MongoDB cluster telemetry, collection counts, and TTL policy.
* `POST /api/scans` — Streams ZIP archive to GridFS, processes code, and inserts BSON scan record.
* `GET /api/scans/{scan_id}/findings` — Queries findings using compound filters and `$text` search index.
* `PATCH /api/findings/{finding_id}/status` — Updates review status directly in MongoDB (`OPEN` ➔ `IN_REVIEW` ➔ `RESOLVED`).
* `GET /api/scans/{scan_id}/download-archive` — Streams the original ZIP file out of GridFS.

