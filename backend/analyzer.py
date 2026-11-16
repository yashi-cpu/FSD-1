"""
SecureCode AI — Core Static & AST Security Analyzer
Developer: Yashi Goel
Handles Zip-slip defensive extraction, AST parsing, secret entropy scoring, and dependency auditing.
"""

import os
import re
import ast
import math
import zipfile
import tempfile
from typing import Dict, List, Any

# Safe ZIP Archive Extraction (Prevents Zip-Slip vulnerability)
def safe_extract_zip(zip_path: str, extract_to: str, max_files: int = 500, max_size_bytes: int = 50 * 1024 * 1024) -> List[str]:
    extracted_files = []
    total_size = 0

    with zipfile.ZipFile(zip_path, 'r') as zf:
        for member in zf.infolist():
            # Check file count limit
            if len(extracted_files) >= max_files:
                raise ValueError("ZIP archive contains too many files (max 500 allowed)")

            total_size += member.file_size
            if total_size > max_size_bytes:
                raise ValueError("ZIP archive exceeded maximum uncompressed size (50MB)")

            # Resolve canonical path to prevent directory traversal
            target_path = os.path.abspath(os.path.join(extract_to, member.filename))
            if not target_path.startswith(os.path.abspath(extract_to)):
                raise SecurityError(f"Zip-slip path traversal attempt detected in: {member.filename}")

            if member.is_dir():
                os.makedirs(target_path, exist_ok=True)
            else:
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with zf.open(member) as source, open(target_path, "wb") as target:
                    target.write(source.read())
                extracted_files.append(target_path)

    return extracted_files


# Calculate Shannon Entropy for secret detection
def calculate_shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0.0
    for x in set(data):
        p_x = float(data.count(x)) / len(data)
        if p_x > 0:
            entropy += - p_x * math.log2(p_x)
    return round(entropy, 2)


# Mask sensitive strings
def mask_secret(value: str) -> str:
    if len(value) <= 8:
        return "••••••••"
    return f"{value[:4]}••••••••••••••••{value[-3:]}"


# Python AST Security Inspector
def analyze_python_ast(source_code: str, file_path: str) -> List[Dict[str, Any]]:
    findings = []
    try:
        tree = ast.parse(source_code)
    except SyntaxError:
        return findings

    for node in ast.walk(tree):
        # 1. Check for command execution: os.system, subprocess.Popen
        if isinstance(node, ast.Call):
            func_name = ""
            if isinstance(node.func, ast.Attribute):
                func_name = node.func.attr
            elif isinstance(node.func, ast.Name):
                func_name = node.func.id

            if func_name in ["system", "popen", "spawn"]:
                findings.append({
                    "id": f"rce-ast-{node.lineno}",
                    "type": "Command Injection",
                    "severity": "CRITICAL",
                    "cwe": "CWE-78",
                    "title": f"Dangerous Process Execution via {func_name}()",
                    "line": node.lineno,
                    "sink": f"os.{func_name}()",
                    "description": "Executing untrusted command strings allows arbitrary shell execution.",
                    "fix_explanation": "Use `subprocess.run` with `shell=False` and separate argument list."
                })

            if func_name in ["eval", "exec"]:
                findings.append({
                    "id": f"eval-ast-{node.lineno}",
                    "type": "Code Execution",
                    "severity": "CRITICAL",
                    "cwe": "CWE-95",
                    "title": f"Dynamic Code Evaluation via {func_name}()",
                    "line": node.lineno,
                    "sink": f"{func_name}()",
                    "description": "Dynamic evaluation of untrusted strings permits arbitrary remote code execution.",
                    "fix_explanation": "Use `ast.literal_eval` or strict JSON parsing instead of raw eval."
                })

        # 2. Check for SQL string formatting / concatenation in queries
        if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.Mod)):
            # Look for SQL keywords
            code_segment = ast.unparse(node) if hasattr(ast, "unparse") else ""
            if re.search(r"(SELECT|INSERT|UPDATE|DELETE)\s+.*FROM", code_segment, re.IGNORECASE):
                findings.append({
                    "id": f"sqli-ast-{node.lineno}",
                    "type": "SQL Injection",
                    "severity": "CRITICAL",
                    "cwe": "CWE-89",
                    "title": "SQL Query Formed via Binary String Concatenation",
                    "line": node.lineno,
                    "sink": "database.execute()",
                    "description": "Dynamic SQL construction using raw string operators permits SQL injection.",
                    "fix_explanation": "Use parameterized queries with placeholder bindings."
                })

    return findings

