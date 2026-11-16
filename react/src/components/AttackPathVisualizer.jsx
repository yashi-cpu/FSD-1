import React, { useState } from 'react';

export default function AttackPathVisualizer({ attackPaths = [] }) {
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);

  const activePath = attackPaths[selectedPathIndex] || attackPaths[0];

  return (
    <section id="attack-paths" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="eyebrow text-green-300/50 mb-3 font-mono">
            05 / SOURCE-TO-SINK RELATIONSHIPS & ATTACK PATHS
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-[-.05em]">
            Attack-Path <span className="green">Visualizer</span>
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-xl leading-relaxed">
            Traces untrusted data ingress points (Source) through API controllers and business logic down to
            dangerous execution sinks (Database queries, OS shells, and File system operations).
          </p>
        </div>

        {/* PATH SELECTOR TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {attackPaths.map((p, idx) => (
            <button
              key={p.id || idx}
              onClick={() => setSelectedPathIndex(idx)}
              type="button"
              className={`px-5 py-2.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 ${
                selectedPathIndex === idx
                  ? 'bg-green-400/20 text-[#7cff9b] border border-green-400/40 font-semibold'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:text-white'
              }`}
            >
              <span>{p.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-400/20 text-red-300">
                Risk: {p.riskScore}
              </span>
            </button>
          ))}
        </div>

        {/* INTERACTIVE FLOW GRAPH CONTAINER */}
        {activePath && (
          <div className="feature-card rounded-[28px] p-8 border border-green-400/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-white/40 block mb-1">CORRELATED VECTOR</span>
                <h3 className="text-2xl font-light text-white">{activePath.title}</h3>
                <p className="text-xs text-white/50 mt-1 max-w-2xl">{activePath.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-white/40">CALCULATED RISK:</span>
                <span className="text-2xl font-mono font-bold text-red-400 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20">
                  {activePath.riskScore} / 100
                </span>
              </div>
            </div>

            {/* NODE FLOW SEQUENCE */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {activePath.steps.map((node, i) => (
                  <React.Fragment key={node.step}>
                    <div className="feature-card rounded-2xl p-5 border border-green-400/20 bg-black/60 relative group hover:border-[#7cff9b] transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                          STAGE 0{node.step}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          node.type === 'SOURCE'
                            ? 'text-blue-400'
                            : node.type === 'SINK'
                            ? 'text-red-400'
                            : 'text-[#7cff9b]'
                        }`}>
                          {node.type}
                        </span>
                      </div>

                      <h4 className="text-sm font-medium text-white mb-2 font-mono">
                        {node.name}
                      </h4>

                      <p className="text-xs font-mono text-white/40 break-words leading-relaxed group-hover:text-white/80 transition-colors">
                        {node.detail}
                      </p>
                    </div>

                    {/* Arrow between nodes (hidden on last item) */}
                    {i < activePath.steps.length - 1 && (
                      <div className="hidden md:flex justify-center text-green-400/50 text-xl font-bold animate-pulse -mx-2">
                        ➔
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30">
              <span>AST Static Taint Analysis Model</span>
              <span className="green">✓ PATH CORRELATED VIA HEURISTICS</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

