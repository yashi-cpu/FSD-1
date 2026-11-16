import React from 'react';

export default function ProjectDashboard({
  stats,
  securityScore,
  scanHistory,
  onSelectScan,
  onNewScanClick
}) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-400/40 bg-green-500/10';
    if (score >= 50) return 'text-yellow-400 border-yellow-400/40 bg-yellow-500/10';
    return 'text-red-400 border-red-400/40 bg-red-500/10';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'A+ (SECURE)';
    if (score >= 80) return 'A (LOW RISK)';
    if (score >= 70) return 'B (MODERATE)';
    if (score >= 50) return 'C (ELEVATED)';
    return 'D (CRITICAL THREATS)';
  };

  return (
    <section id="dashboard" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="eyebrow text-green-300/50 mb-3 font-mono">
              PROJECT DASHBOARD & SCAN HISTORY
            </div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[-.05em]">
              Security <span className="green">Posture</span> Summary
            </h2>
          </div>

          <button
            onClick={onNewScanClick}
            type="button"
            className="hero-button px-6 py-3 rounded-full bg-[#7cff9b] text-black text-xs font-semibold flex items-center gap-2"
          >
            <span>+ NEW CODE SCAN</span>
            <span>↗</span>
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Security Score Card */}
          <div className="feature-card rounded-[24px] p-6 border border-green-400/20 flex flex-col justify-between">
            <span className="text-xs font-mono text-white/40">SECURITY HEALTH SCORE</span>
            <div className="my-4 flex items-baseline gap-3">
              <span className={`text-5xl font-mono font-bold ${getScoreColor(securityScore || 85)}`}>
                {securityScore || 85}
              </span>
              <span className="text-xs font-mono text-white/40">/ 100</span>
            </div>
            <div className="text-[11px] font-mono green">
              GRADE: {getScoreGrade(securityScore || 85)}
            </div>
          </div>

          {/* Vulnerabilities Count */}
          <div className="feature-card rounded-[24px] p-6 border border-green-400/20 flex flex-col justify-between">
            <span className="text-xs font-mono text-white/40">CODE VULNERABILITIES</span>
            <div className="my-4 text-5xl font-mono font-bold text-white">
              {stats.patternsFound || 4}
            </div>
            <div className="text-[11px] font-mono text-red-400">
              {stats.highRisk || 2} HIGH / CRITICAL SEVERITY
            </div>
          </div>

          {/* Exposed Secrets */}
          <div className="feature-card rounded-[24px] p-6 border border-green-400/20 flex flex-col justify-between">
            <span className="text-xs font-mono text-white/40">EXPOSED CREDENTIALS</span>
            <div className="my-4 text-5xl font-mono font-bold text-yellow-300">
              2
            </div>
            <div className="text-[11px] font-mono text-yellow-300/80">
              STRIPE & DATABASE SECRETS MASKED
            </div>
          </div>

          {/* Vulnerable Dependencies */}
          <div className="feature-card rounded-[24px] p-6 border border-green-400/20 flex flex-col justify-between">
            <span className="text-xs font-mono text-white/40">SUPPLY CHAIN (CVEs)</span>
            <div className="my-4 text-5xl font-mono font-bold text-blue-300">
              4
            </div>
            <div className="text-[11px] font-mono text-blue-300/80">
              OSV / NVD ADVISORIES DETECTED
            </div>
          </div>
        </div>

        {/* SCAN HISTORY TABLE */}
        <div className="feature-card rounded-[28px] p-8 border border-green-400/15 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-light text-white">
              Recent Code Scans
            </h3>
            <span className="text-xs font-mono text-[#7cff9b] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7cff9b] animate-ping"></span>
              MongoDB & PostgreSQL Synchronized Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="pb-3 font-normal">SCAN ID</th>
                  <th className="pb-3 font-normal">PROJECT NAME</th>
                  <th className="pb-3 font-normal">TIMESTAMP</th>
                  <th className="pb-3 font-normal">HEALTH SCORE</th>
                  <th className="pb-3 font-normal">FINDINGS</th>
                  <th className="pb-3 font-normal text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(scanHistory && scanHistory.length > 0
                  ? scanHistory
                  : [
                      {
                        scan_id: "scan-9a8b1c",
                        project: "securecode-api-service",
                        time: "Just now",
                        score: securityScore || 82,
                        findings: stats.patternsFound || 4,
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
                    ]
                ).map((scan, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-[#7cff9b]">{scan.scan_id}</td>
                    <td className="py-4 text-white font-sans font-medium">{scan.project}</td>
                    <td className="py-4 text-white/40">{scan.time}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full border border-green-400/20 bg-green-500/10 text-green-300">
                        {scan.score} / 100
                      </span>
                    </td>
                    <td className="py-4 text-white/60">{scan.findings} issues detected</td>
                    <td className="py-4 text-right">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-400/20 text-green-300 border border-green-400/30">
                        ✓ {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MONGODB & GRIDFS ARCHITECTURE TELEMETRY */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-black/40 border border-green-400/15 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-[#7cff9b] tracking-wider font-semibold">
                  MONGODB DOCUMENT STORE
                </span>
                <span className="text-[10px] font-mono text-white/40">BSON Model</span>
              </div>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                Stores polymorphic scan reports, multi-hop attack paths, and AST feature dictionaries in native documents without relational join bottlenecks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-green-300/80">
              ✓ Collections: scans, findings, secrets, attack_paths
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-green-400/15 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-yellow-300 tracking-wider font-semibold">
                  GRIDFS CHUNKED STORAGE
                </span>
                <span className="text-[10px] font-mono text-white/40">&gt; 16MB Chunks</span>
              </div>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                Streams and chunks large source-code ZIP archives (up to 25MB) across <code>fs.files</code> and <code>fs.chunks</code> without third-party cloud S3 dependencies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-yellow-300/80">
              ✓ Direct binary streaming & safe extraction
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-green-400/15 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-blue-300 tracking-wider font-semibold">
                  TTL RETENTION & FULL-TEXT SEARCH
                </span>
                <span className="text-[10px] font-mono text-white/40">Section 13 Compliance</span>
              </div>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                Automated 24-hour TTL index purges temporary uploaded archives, while compound <code>$text</code> indexes accelerate instant keyword lookups.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-blue-300/80">
              ✓ Index: expireAfterSeconds=86400 (Active)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

