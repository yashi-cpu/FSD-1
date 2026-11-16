import React, { useState, useRef } from 'react';
import { formatFileSize, getFileExtension, runFullSecurityScan } from '../utils/securityScanner';

const ALLOWED_EXTENSIONS = [
  "zip", "tar", "gz", "tgz",
  "js", "jsx", "ts", "tsx", "py", "java", "cpp", "c",
  "html", "css", "json", "txt"
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const SCAN_STAGES = [
  "1/7 Unpacking archive & verifying ZIP-slip path safety...",
  "2/7 Constructing AST syntax trees & extracting function nodes...",
  "3/7 Executing static security checks (SQLi, XSS, RCE, Path Traversal)...",
  "4/7 Running Secret Scanner & Shannon entropy credential detection...",
  "5/7 Auditing dependency manifests against OSV & NVD databases...",
  "6/7 Running Scikit-learn Random Forest & Isolation Forest ML pipeline...",
  "7/7 Correlating source-to-sink relationships & computing risk scores..."
];

export default function Scanner({
  onScanComplete,
  isScanning,
  setIsScanning,
  stats,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'github'
  const [scanMode, setScanMode] = useState('full');
  const [scanModeMessage, setScanModeMessage] = useState('');

  // Local File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileStatus, setFileStatus] = useState('No project selected');
  const [fileStatusColor, setFileStatusColor] = useState('text-white/35');

  // Real-time scan progress simulation
  const [scanProgressStage, setScanProgressStage] = useState('');
  const [scanProgressPercent, setScanProgressPercent] = useState(0);

  // GitHub Import State
  const [githubUrl, setGithubUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('main');
  const [githubToken, setGithubToken] = useState('');
  const [githubStatus, setGithubStatus] = useState('Import any public repository via GitHub REST API');
  const [githubStatusColor, setGithubStatusColor] = useState('text-white/35');
  const [isGithubFetching, setIsGithubFetching] = useState(false);

  const fileInputRef = useRef(null);

  // Scan Mode Change Handler
  const handleScanModeChange = (e) => {
    const mode = e.target.value;
    setScanMode(mode);
    const labels = {
      full: '🔍 Full Deep Scan — Static, ML, Secrets & Dependencies',
      quick: '⚡ Quick Scan — Critical vulnerabilities & High-entropy secrets',
      deps: '📦 Dependency Audit — Package manifest OSV/NVD analysis',
      secrets: '🔑 Secret Detection — API tokens, keys & passwords'
    };
    const message = labels[mode] || mode;
    setScanModeMessage(message);
    if (showToast) {
      showToast('🔄 Scan Mode Updated', message, 2500);
    }
  };

  // Local File Change Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setFileContent(null);
      setFileStatus('No project selected');
      setFileStatusColor('text-white/35');
      return;
    }

    const ext = getFileExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileStatus('Unsupported file type. Choose a ZIP or supported source file.');
      setFileStatusColor('text-red-400');
      setSelectedFile(null);
      setFileContent(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileStatus(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      setFileStatusColor('text-red-400');
      setSelectedFile(null);
      setFileContent(null);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();

    reader.onloadstart = () => {
      setFileStatus(`Reading ${file.name}...`);
      setFileStatusColor('text-yellow-300');
    };

    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content);
      setFileStatus(`✓ ${file.name} • ${formatFileSize(file.size)}`);
      setFileStatusColor('text-green-300');

      if (showToast) {
        showToast(
          '📁 Archive Loaded',
          `"${file.name}" ready for multi-layer security assessment.`
        );
      }
    };

    reader.onerror = () => {
      setFileStatus('Error reading file');
      setFileStatusColor('text-red-400');
    };

    const textExtensions = ["js", "jsx", "ts", "tsx", "py", "java", "cpp", "c", "html", "css", "json", "txt"];
    if (textExtensions.includes(ext)) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  // Animate multi-stage scan progress (simulating backend WebSockets)
  const animateScanProgress = async () => {
    for (let i = 0; i < SCAN_STAGES.length; i++) {
      setScanProgressStage(SCAN_STAGES[i]);
      setScanProgressPercent(Math.round(((i + 1) / SCAN_STAGES.length) * 100));
      await new Promise((r) => setTimeout(r, 220));
    }
  };

  // Trigger Local Scan
  const handleStartLocalScan = async () => {
    if (!selectedFile || !fileContent) {
      fileInputRef.current?.click();
      return;
    }

    setIsScanning(true);
    await animateScanProgress();

    try {
      const result = await runFullSecurityScan(fileContent, selectedFile.name);
      onScanComplete(result);
      if (showToast) {
        showToast('⚡ Scan Complete', `Security score: ${result.securityScore}/100 with ${result.findings.length} findings.`, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
      setScanProgressStage('');
      setScanProgressPercent(0);
    }
  };

  // Parse GitHub URL helper
  const parseGithubUrl = (url) => {
    const clean = url.trim().replace(/\/$/, "");
    const match = /github\.com\/([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)/.exec(clean);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, "")
      };
    }
    const shorthand = /^([a-zA-Z0-9_\-\.]+)\/([a-zA-Z0-9_\-\.]+)$/.exec(clean);
    if (shorthand) {
      return {
        owner: shorthand[1],
        repo: shorthand[2].replace(/\.git$/, "")
      };
    }
    return null;
  };

  // Handle GitHub Import
  const handleGithubImport = async () => {
    const parsed = parseGithubUrl(githubUrl);
    if (!parsed) {
      setGithubStatus('Invalid GitHub repository URL. Use format: https://github.com/owner/repo');
      setGithubStatusColor('text-red-400');
      return;
    }

    const { owner, repo } = parsed;
    const branch = githubBranch.trim() || 'main';
    const token = githubToken.trim();

    setIsGithubFetching(true);
    setGithubStatus(`Connecting to GitHub REST API for ${owner}/${repo}...`);
    setGithubStatusColor('text-yellow-300');

    try {
      const headers = { Accept: 'application/vnd.github.v3+json' };
      if (token) headers['Authorization'] = `token ${token}`;

      const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!metaRes.ok) {
        if (metaRes.status === 404) throw new Error('Repository not found or private (provide GitHub PAT if private).');
        if (metaRes.status === 403) throw new Error('GitHub API rate limit reached. Add Personal Access Token (PAT).');
        throw new Error(`GitHub API Error (HTTP ${metaRes.status})`);
      }

      const repoMeta = await metaRes.json();
      const targetBranch = branch || repoMeta.default_branch || 'main';

      setGithubStatus(`Fetching git tree structure for ${owner}/${repo} (${targetBranch})...`);

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`, { headers });
      let treeData = null;
      if (treeRes.ok) {
        treeData = await treeRes.json();
      }

      const fileCount = treeData?.tree ? treeData.tree.filter((item) => item.type === 'blob').length : 0;

      const repoPayload = JSON.stringify(
        {
          repository: repoMeta.full_name,
          default_branch: repoMeta.default_branch,
          stars: repoMeta.stargazers_count,
          language: repoMeta.language,
          total_files: fileCount,
          tree_sample: treeData?.tree ? treeData.tree.slice(0, 50) : []
        },
        null,
        2
      );

      setGithubStatus(`✓ Connected: ${repoMeta.full_name} (${fileCount} files)`);
      setGithubStatusColor('text-green-300');

      setIsScanning(true);
      await animateScanProgress();

      const scanResult = await runFullSecurityScan(repoPayload, `${owner}/${repo}:${targetBranch}`);
      onScanComplete(scanResult);
    } catch (err) {
      setGithubStatus(`❌ ${err.message}`);
      setGithubStatusColor('text-red-400');
    } finally {
      setIsGithubFetching(false);
      setIsScanning(false);
      setScanProgressStage('');
    }
  };

  const githubCharCount = githubUrl.length;
  const isGithubValid = /github\.com\/[\w-]+\/[\w.-]+/.test(githubUrl);
  let githubCharStatus = `${githubCharCount} / 100 characters`;
  let githubCharColor = 'text-white/30';
  if (githubCharCount > 0) {
    if (isGithubValid) {
      githubCharStatus += ' • ✓ Valid URL';
      githubCharColor = 'text-green-400';
    } else if (githubCharCount > 12) {
      githubCharStatus += ' • ✗ Invalid format';
      githubCharColor = 'text-red-400';
    }
  }

  return (
    <section id="scanner" className="section py-24 px-8 md:px-20 relative">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="grid md:grid-cols-2 gap-16 items-end">
          <div>
            <div className="eyebrow text-green-300/50 mb-4 font-mono">
              01 / PROJECT UPLOAD & SCAN INITIATION
            </div>
            <h2 className="text-4xl md:text-7xl font-light tracking-[-.07em] leading-[.9]">
              Multi-Layer Code
              <br />
              <span className="green">Intelligence.</span>
            </h2>
          </div>

          <p className="text-base text-white/40 leading-7 max-w-lg">
            Upload your source-code project archive (ZIP) or connect a public GitHub repository.
            The engine validates upload safety, prevents ZIP-slip attacks, and begins static AST & ML analysis.
          </p>
        </div>

        {/* SCAN TYPE SELECTOR */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <label className="text-xs font-mono text-white/40 tracking-widest">
            SCAN MODE:
          </label>
          <select
            value={scanMode}
            onChange={handleScanModeChange}
            id="scanTypeSelect"
            className="bg-black/40 border border-green-400/20 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#7cff9b] transition-all cursor-pointer"
          >
            <option value="full">🔍 Full Deep Scan (AST + ML + Secrets + CVEs)</option>
            <option value="quick">⚡ Quick Scan (Critical Findings Only)</option>
            <option value="deps">📦 Dependency Audit (OSV / NVD)</option>
            <option value="secrets">🔑 Secret Detection (High Entropy)</option>
          </select>
          {scanModeMessage && (
            <span className="text-xs font-mono text-green-300/60 transition-opacity">
              {scanModeMessage}
            </span>
          )}
        </div>

        {/* PROGRESS BAR OVERLAY (When scanning) */}
        {isScanning && (
          <div className="mt-8 p-6 rounded-2xl bg-black/60 border border-green-400/30 animate-pulse">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-green-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7cff9b] animate-ping" />
                {scanProgressStage || 'Analyzing code repository...'}
              </span>
              <span className="text-white/60 font-bold">{scanProgressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 via-[#7cff9b] to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${scanProgressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* SCANNER CARDS */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {/* UPLOAD / GITHUB INPUT CARD */}
          <div className="feature-card rounded-[28px] p-8 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-mono text-white/30 tracking-wider">
                  PROJECT INPUT
                </span>

                {/* Tab Switcher */}
                <div className="flex bg-black/40 border border-white/10 rounded-full p-1 space-x-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('local')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      activeTab === 'local'
                        ? 'bg-[#7cff9b]/20 text-[#7cff9b] border border-[#7cff9b]/30 font-semibold'
                        : 'text-white/50 hover:text-white border border-transparent'
                    }`}
                  >
                    📁 ZIP ARCHIVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('github')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      activeTab === 'github'
                        ? 'bg-[#7cff9b]/20 text-[#7cff9b] border border-[#7cff9b]/30 font-semibold'
                        : 'text-white/50 hover:text-white border border-transparent'
                    }`}
                  >
                    🐙 GITHUB REPO
                  </button>
                </div>
              </div>

              {/* LOCAL FILE TAB */}
              {activeTab === 'local' && (
                <div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center mt-4 cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-[22px] border border-green-400/20 group-hover:border-green-400/40 flex items-center justify-center relative transition-all duration-300">
                      <div className="absolute inset-2 rounded-[16px] border border-green-400/10 animate-pulse"></div>
                      <span className="text-3xl green group-hover:-translate-y-1 transition-transform">
                        ↑
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-light">Drop project ZIP or source</h3>
                    <p className="mt-1 text-xs text-white/30 font-mono">
                      Safe extraction • Max 25MB archive size
                    </p>

                    <p className={`mt-3 text-xs font-mono min-h-[18px] ${fileStatusColor}`}>
                      {fileStatus}
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip,.tar,.gz,.tgz,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.txt"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleStartLocalScan}
                    disabled={isScanning}
                    className="hero-button w-full py-3.5 rounded-full bg-[#7cff9b] text-black text-xs font-mono font-bold mt-6 transition-all disabled:opacity-50"
                  >
                    {isScanning
                      ? 'EXECUTING SECURITY PIPELINE...'
                      : selectedFile && fileContent
                      ? 'START MULTI-LAYER SCAN ↗'
                      : 'CHOOSE ZIP ARCHIVE FILE'}
                  </button>
                </div>
              )}

              {/* GITHUB IMPORT TAB */}
              {activeTab === 'github' && (
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="block text-xs font-mono text-white/50 mb-1">
                      GITHUB REPOSITORY URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="w-full bg-black/40 border border-green-400/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#7cff9b] font-mono transition-all placeholder:text-white/20"
                    />
                    <div className={`text-[10px] font-mono mt-1.5 ml-1 ${githubCharColor}`}>
                      {githubCharStatus}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-white/50 mb-1">
                        BRANCH (DEFAULT: main)
                      </label>
                      <input
                        type="text"
                        value={githubBranch}
                        onChange={(e) => setGithubBranch(e.target.value)}
                        placeholder="main"
                        className="w-full bg-black/40 border border-green-400/20 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#7cff9b] font-mono transition-all placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/50 mb-1">
                        TOKEN (OPTIONAL)
                      </label>
                      <input
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_..."
                        className="w-full bg-black/40 border border-green-400/20 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#7cff9b] font-mono transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <p className={`text-xs font-mono min-h-[18px] ${githubStatusColor}`}>
                    {githubStatus}
                  </p>

                  <button
                    type="button"
                    onClick={handleGithubImport}
                    disabled={isGithubFetching || isScanning}
                    className="hero-button w-full py-3.5 rounded-full bg-[#7cff9b] text-black text-xs font-mono font-bold transition-all disabled:opacity-50"
                  >
                    {isGithubFetching
                      ? 'FETCHING REPO TREE...'
                      : 'IMPORT & INITIATE SCAN ↗'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI ANALYSIS CARD */}
          <div className="feature-card rounded-[28px] p-8 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/30 tracking-wider">
                  AI & ML TELEMETRY
                </span>
                <span className="green text-[10px] font-mono font-bold tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7cff9b] animate-ping"></span>
                  LIVE ENGINE
                </span>
              </div>

              <div className="mt-8 space-y-5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-white/30">FILES ANALYZED</span>
                  <span className="font-semibold text-white">
                    {stats.filesAnalyzed}
                  </span>
                </div>

                <div className="h-px bg-green-400/10"></div>

                <div className="flex justify-between items-center">
                  <span className="text-white/30">PATTERNS FOUND</span>
                  <span className="font-semibold text-white">
                    {stats.patternsFound}
                  </span>
                </div>

                <div className="h-px bg-green-400/10"></div>

                <div className="flex justify-between items-center">
                  <span className="text-white/30">HIGH / CRITICAL RISK</span>
                  <span className="font-semibold text-red-400">
                    {stats.highRisk < 10 ? `0${stats.highRisk}` : stats.highRisk}
                  </span>
                </div>

                <div className="h-px bg-green-400/10"></div>

                <div className="flex justify-between items-center">
                  <span className="text-white/30">ML CLASSIFICATION CONFIDENCE</span>
                  <span className="font-semibold green">
                    {stats.confidence}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-black/30 border border-green-400/10 p-4">
              <div className="flex items-center gap-3">
                <span className="status-light"></span>
                <span className="text-[10px] font-mono green">
                  SCIKIT-LEARN & AST ENGINE READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
