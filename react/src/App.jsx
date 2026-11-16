import React, { useState, useEffect, useCallback } from 'react';
import Hero from './components/Hero';
import ProjectDashboard from './components/ProjectDashboard';
import Scanner from './components/Scanner';
import Vulnerabilities from './components/Vulnerabilities';
import SecretsScanner from './components/SecretsScanner';
import DependencyScanner from './components/DependencyScanner';
import AttackPathVisualizer from './components/AttackPathVisualizer';
import MlIntelligence from './components/MlIntelligence';
import Capabilities from './components/Capabilities';
import About from './components/About';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AiFixModal from './components/AiFixModal';
import ReportModal from './components/ReportModal';
import EventHandlingOverlay from './components/EventHandlingOverlay';
import { runFullSecurityScan, syncFindingStatus } from './utils/securityScanner';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Scan & Threat Findings State
  const [projectName, setProjectName] = useState('securecode-api-service');
  const [securityScore, setSecurityScore] = useState(82);
  const [threats, setThreats] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [attackPaths, setAttackPaths] = useState([]);
  const [mlPredictions, setMlPredictions] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [scanSource, setScanSource] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  const [stats, setStats] = useState({
    filesAnalyzed: 0,
    patternsFound: 0,
    highRisk: 0,
    confidence: '--%'
  });

  // Modal States
  const [selectedThreatForFix, setSelectedThreatForFix] = useState(null);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((title, body, duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, body }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initialize session & load event toast
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');
    if (token && userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }

    // Load initial sample scan state so dashboard is immediately rich & populated
    runFullSecurityScan("", "securecode-api-service.zip").then((res) => {
      setThreats(res.findings);
      setSecrets(res.secrets);
      setDependencies(res.dependencies);
      setAttackPaths(res.attackPaths);
      setMlPredictions(res.mlPredictions);
      setSecurityScore(res.securityScore);
      setHasScanned(true);
      setScanSource(res.source);

      const highCount = res.findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH').length;
      setStats({
        filesAnalyzed: 14,
        patternsFound: res.findings.length,
        highRisk: highCount,
        confidence: '96%'
      });

      setScanHistory([
        {
          scan_id: res.scan_id,
          project: "securecode-api-service",
          time: "Just now",
          score: res.securityScore,
          findings: res.findings.length,
          status: "COMPLETED"
        },
        {
          scan_id: "scan-7f2e4d",
          project: "auth-jwt-microservice",
          time: "2 hours ago",
          score: 91,
          findings: 1,
          status: "COMPLETED"
        },
        {
          scan_id: "scan-3c1a89",
          project: "payment-stripe-gateway",
          time: "Yesterday",
          score: 64,
          findings: 7,
          status: "COMPLETED"
        }
      ]);
    });

    showToast(
      '🛡️ SOC-AI Platform Online',
      'SecureCode AI initialized. Developed by Yashi Goel. All modules active.'
    );
  }, [showToast]);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    showToast('🔒 Logged Out', 'Your security session has ended.');
  };

  // When a scan completes
  const handleScanComplete = (result) => {
    setProjectName(result.project_name || 'Uploaded-Project');
    setThreats(result.findings || []);
    setSecrets(result.secrets || []);
    setDependencies(result.dependencies || []);
    setAttackPaths(result.attackPaths || []);
    setMlPredictions(result.mlPredictions || null);
    setSecurityScore(result.securityScore || 80);
    setHasScanned(true);
    setScanSource(result.source);

    const highCount = (result.findings || []).filter(
      (f) => f.severity === 'CRITICAL' || f.severity === 'HIGH'
    ).length;

    setStats({
      filesAnalyzed: 1,
      patternsFound: result.findings?.length || 0,
      highRisk: highCount,
      confidence: result.findings?.length > 0 ? '96%' : '99%'
    });

    // Update scan history
    setScanHistory((prev) => [
      {
        scan_id: result.scan_id || `scan-${Date.now().toString(36)}`,
        project: result.project_name || 'Uploaded-Project',
        time: 'Just now',
        score: result.securityScore || 80,
        findings: result.findings?.length || 0,
        status: 'COMPLETED'
      },
      ...prev.slice(0, 4)
    ]);

    // Scroll to dashboard
    setTimeout(() => {
      document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Update Review Status of a Finding (Open / In Review / Resolved)
  const handleUpdateFindingStatus = (findingId, newStatus) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === findingId ? { ...t, reviewStatus: newStatus } : t))
    );
    // Asynchronously synchronize status change to MongoDB backend
    syncFindingStatus(findingId, newStatus);
  };

  const handleOpenAiFix = (threat) => {
    setSelectedThreatForFix(threat);
    setIsFixModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020503] text-[#f4fff7] relative selection:bg-[#7cff9b]/30 selection:text-[#7cff9b]">
      {/* Event Handling Overlays */}
      <EventHandlingOverlay toasts={toasts} removeToast={removeToast} />

      {/* Hero Section */}
      <Hero
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Project Dashboard & Scan History */}
      <ProjectDashboard
        stats={stats}
        securityScore={securityScore}
        scanHistory={scanHistory}
        onNewScanClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* 01 Intelligent Scanner Section */}
      <Scanner
        onScanComplete={handleScanComplete}
        isScanning={isScanning}
        setIsScanning={setIsScanning}
        stats={stats}
        showToast={showToast}
      />

      {/* 02 Detected Vulnerabilities Section */}
      <Vulnerabilities
        threats={threats}
        hasScanned={hasScanned}
        scanSource={scanSource}
        onOpenAiFix={handleOpenAiFix}
        onUpdateStatus={handleUpdateFindingStatus}
        showToast={showToast}
      />

      {/* 03 Secret Detection Page */}
      <SecretsScanner secrets={secrets} showToast={showToast} />

      {/* 04 Dependency Vulnerability Analysis */}
      <DependencyScanner dependencies={dependencies} />

      {/* 05 Attack-Path Visualizer */}
      <AttackPathVisualizer attackPaths={attackPaths} />

      {/* 06 Scikit-Learn & AST Machine Learning Engine */}
      <MlIntelligence mlData={mlPredictions} />

      {/* Capabilities Section */}
      <Capabilities showToast={showToast} />

      {/* About Section */}
      <About />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        showToast={showToast}
      />

      <AiFixModal
        isOpen={isFixModalOpen}
        threat={selectedThreatForFix}
        onClose={() => setIsFixModalOpen(false)}
        showToast={showToast}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        projectName={projectName}
        stats={stats}
        securityScore={securityScore}
        findings={threats}
        secrets={secrets}
        dependencies={dependencies}
        mlPredictions={mlPredictions}
      />
    </div>
  );
}
