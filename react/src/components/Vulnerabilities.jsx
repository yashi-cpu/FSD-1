import React, { useState } from 'react';

export default function Vulnerabilities({
  threats,
  hasScanned,
  scanSource,
  onOpenAiFix,
  onUpdateStatus,
  showToast
}) {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreats = threats.filter((t) => {
    // Severity Filter
    if (severityFilter !== 'all' && t.severity.toUpperCase() !== severityFilter.toUpperCase()) {
      return false;
    }
    // Review Status Filter
    if (statusFilter !== 'all' && (t.reviewStatus || 'OPEN').toUpperCase() !== statusFilter.toUpperCase()) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchType = t.type?.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchCwe = t.cwe?.toLowerCase().includes(q);
      if (!matchTitle && !matchType && !matchDesc && !matchCwe) return false;
    }
    return true;
  });

  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-300 bg-red-500/20 border-red-500/40 font-bold';
      case 'HIGH':
        return 'text-red-300 bg-red-400/10 border-red-400/30';
      case 'MEDIUM':
        return 'text-yellow-300 bg-yellow-400/10 border-yellow-400/30';
      case 'LOW':
      default:
        return 'text-blue-300 bg-blue-400/10 border-blue-400/30';
    }
  };

  const getStatusBadge = (status) => {
    switch ((status || 'OPEN').toUpperCase()) {
      case 'RESOLVED':
        return 'text-green-300 bg-green-500/10 border-green-500/30';
      case 'IN_REVIEW':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
      case 'OPEN':
      default:
        return 'text-red-300 bg-red-500/10 border-red-500/30';
    }
  };

  const handleStatusCycle = (threat) => {
    const current = threat.reviewStatus || 'OPEN';
    const next = current === 'OPEN' ? 'IN_REVIEW' : current === 'IN_REVIEW' ? 'RESOLVED' : 'OPEN';
    if (onUpdateStatus) {
      onUpdateStatus(threat.id, next);
      if (showToast) {
        showToast('🔄 Finding Status Updated', `${threat.title}: ${next}`, 2000);
      }
    }
  };

  return (
    <section id="vulnerabilities" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="eyebrow text-green-300/50 mb-3 font-mono">
              02 / STATIC ANALYSIS FINDINGS & VULNERABILITIES
            </div>
            <h2 className="text-4xl md:text-6xl font-light tracking-[-.06em]">
              Detected <span className="green">Vulnerabilities</span>
            </h2>
            <p className="mt-4 text-sm text-white/40 max-w-xl leading-relaxed">
              Security weaknesses identified via AST analysis and rule patterns. Filter, search, and update
              review states to prioritize remediation.
            </p>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="w-full md:w-auto flex flex-col gap-3 font-mono text-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings (e.g. SQL, CWE-89, innerHTML)..."
              className="bg-black/40 border border-green-400/20 rounded-xl px-4 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-[#7cff9b] transition-all"
            />

            {/* SEVERITY FILTERS */}
            <div className="flex flex-wrap gap-2">
              {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSeverityFilter(lvl)}
                  type="button"
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    severityFilter === lvl
                      ? 'bg-green-400/20 text-green-300 border border-green-400/30 font-semibold'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:text-white'
                  }`}
                >
                  {lvl === 'all' ? 'ALL' : lvl}
                </button>
              ))}
            </div>

            {/* STATUS FILTERS */}
            <div className="flex flex-wrap gap-2">
              {['all', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  type="button"
                  className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                    statusFilter === st
                      ? 'bg-white/20 text-white border border-white/40 font-semibold'
                      : 'bg-black/30 text-white/40 border border-white/5 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'ALL STATUS' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS CONTAINER */}
        <div className="space-y-4">
          {!hasScanned ? (
            <div className="feature-card rounded-[28px] p-12 text-center border border-dashed border-green-400/20">
              <div className="w-16 h-16 mx-auto rounded-full border border-green-400/20 flex items-center justify-center text-green-400 text-2xl font-mono mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-light text-white mb-2">
                Awaiting Code Analysis
              </h3>
              <p className="text-sm text-white/35 max-w-md mx-auto">
                Upload a source-code ZIP file above and click <span className="green font-medium">START ANALYSIS</span> to run
                the ML & AST threat detection engine.
              </p>
            </div>
          ) : filteredThreats.length === 0 ? (
            <div className="feature-card rounded-[28px] p-10 text-center border border-green-400/20">
              <div className="text-3xl mb-3">✓</div>
              <h4 className="text-lg text-white font-light">
                No matching vulnerabilities found
              </h4>
              <p className="text-xs text-white/40 mt-1 font-mono">
                No findings match the current filter or search criteria.
              </p>
            </div>
          ) : (
            filteredThreats.map((threat, index) => (
              <div
                key={threat.id || index}
                className="feature-card rounded-[24px] p-6 border border-green-400/15 hover:border-green-400/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${getSeverityStyle(threat.severity)}`}>
                      {threat.severity}
                    </span>
                    {threat.cwe && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded border border-white/10 text-white/40">
                        {threat.cwe}
                      </span>
                    )}
                    <h4 className="text-lg font-light text-white font-mono">
                      {threat.title || threat.type}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status updater toggle */}
                    <button
                      onClick={() => handleStatusCycle(threat)}
                      type="button"
                      title="Click to cycle review status"
                      className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all ${getStatusBadge(
                        threat.reviewStatus
                      )}`}
                    >
                      ● {threat.reviewStatus || 'OPEN'} (CLICK TO CHANGE)
                    </button>

                    <button
                      onClick={() => onOpenAiFix(threat)}
                      type="button"
                      className="text-xs font-mono text-green-300 hover:text-green-200 px-4 py-1.5 rounded-full border border-green-400/30 hover:bg-green-400/10 transition-colors flex items-center gap-1.5"
                    >
                      <span>AI REMEDIATION</span>
                      <span>✦</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-white/50 leading-relaxed font-sans">
                  {threat.description}
                </p>

                {/* SINK & CODE PREVIEW */}
                {threat.codeSnippet && (
                  <div className="bg-black/60 border border-green-400/10 rounded-xl p-3.5 font-mono text-xs text-red-300/90 overflow-x-auto">
                    <div className="text-[10px] text-white/30 mb-1">
                      AFFECTED CODE (Line {threat.line}) • Sink: {threat.sink || 'Dynamic Execution'}
                    </div>
                    <code>{threat.codeSnippet}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
