"""
SecureCode AI (SOC-AI) — SQLAlchemy Database Models
Developer: Yashi Goel
Implements Section 11 of Project Report (PostgreSQL Implementation).
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"
    project_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    project_name = Column(String(150), nullable=False)
    repository_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    scans = relationship("Scan", back_populates="project", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"
    scan_id = Column(String(50), primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), nullable=False)
    status = Column(String(50), default="QUEUED")  # QUEUED, RUNNING, COMPLETED, FAILED
    security_score = Column(Integer, default=100)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="scans")
    files = relationship("AnalyzedFile", back_populates="scan", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")
    dependencies = relationship("Dependency", back_populates="scan", cascade="all, delete-orphan")
    secrets = relationship("Secret", back_populates="scan", cascade="all, delete-orphan")
    attack_paths = relationship("AttackPath", back_populates="scan", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="scan", cascade="all, delete-orphan")


class AnalyzedFile(Base):
    __tablename__ = "files"
    file_id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    file_path = Column(String(300), nullable=False)
    language = Column(String(50), nullable=True)
    file_size = Column(Integer, default=0)

    scan = relationship("Scan", back_populates="files")
    findings = relationship("Finding", back_populates="file", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"
    finding_id = Column(String(60), primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.file_id"), nullable=True)
    type = Column(String(100), nullable=False)
    severity = Column(String(30), nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    confidence = Column(Float, default=0.95)
    risk_score = Column(Integer, default=70)
    line_number = Column(Integer, nullable=True)
    status = Column(String(30), default="OPEN")  # OPEN, IN_REVIEW, RESOLVED
    code_snippet = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    remediation = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="findings")
    file = relationship("AnalyzedFile", back_populates="findings")
    predictions = relationship("MLPrediction", back_populates="finding", cascade="all, delete-orphan")


class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    prediction_id = Column(Integer, primary_key=True, index=True)
    finding_id = Column(String(60), ForeignKey("findings.finding_id"), nullable=False)
    model_name = Column(String(100), nullable=False)
    predicted_label = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)

    finding = relationship("Finding", back_populates="predictions")


class Dependency(Base):
    __tablename__ = "dependencies"
    dependency_id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    package_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    vulnerability_id = Column(String(60), nullable=False)  # CVE ID
    severity = Column(String(30), nullable=False)
    fixed_version = Column(String(50), nullable=True)
    summary = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="dependencies")


class Secret(Base):
    __tablename__ = "secrets"
    secret_id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    file_id = Column(Integer, ForeignKey("files.file_id"), nullable=True)
    secret_type = Column(String(100), nullable=False)
    severity = Column(String(30), nullable=False)
    masked_value = Column(String(150), nullable=False)
    entropy_score = Column(Float, nullable=True)
    line_number = Column(Integer, nullable=True)

    scan = relationship("Scan", back_populates="secrets")


class AttackPath(Base):
    __tablename__ = "attack_paths"
    path_id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    description = Column(Text, nullable=False)
    risk_score = Column(Integer, default=85)
    steps_json = Column(Text, nullable=False)

    scan = relationship("Scan", back_populates="attack_paths")


class Report(Base):
    __tablename__ = "reports"
    report_id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String(50), ForeignKey("scans.scan_id"), nullable=False)
    report_location = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="reports")

