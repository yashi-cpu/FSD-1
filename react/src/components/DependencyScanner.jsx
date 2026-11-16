import React from 'react';

export default function DependencyScanner({ dependencies = [] }) {
  return (
    <section id="dependencies" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="eyebrow text-green-300/50 mb-3 font-mono">
            04 / SOFTWARE SUPPLY CHAIN & DEPENDENCY AUDIT
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-[-.05em]">
            Vulnerable <span className="green">Dependencies</span> (OSV / NVD)
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-xl leading-relaxed">
            Extracts manifests (`package.json`, `requirements.txt`) and cross-references package versions
            against OSV and National Vulnerability Database (NVD) security advisories.
          </p>
        </div>

        {/* DEPENDENCIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dependencies.map((dep, i) => (
            <div
              key={dep.cve || i}
              className="feature-card rounded-[24px] p-6 border border-green-400/15 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-mono font-medium text-white">
                      {dep.package}
                    </span>
                    <span className="text-xs font-mono ml-2 text-white/30">
                      ({dep.ecosystem})
                    </span>
                  </div>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                    dep.severity === 'CRITICAL'
                      ? 'border-red-400/30 bg-red-400/10 text-red-300'
                      : dep.severity === 'HIGH'
                      ? 'border-red-400/20 bg-red-400/5 text-red-400'
                      : 'border-yellow-400/20 bg-yellow-400/5 text-yellow-300'
                  }`}>
                    {dep.severity}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#7cff9b] mb-3">
                  <span>Advisory:</span>
                  <span className="underline decoration-dotted">{dep.cve}</span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-sans mb-4">
                  {dep.summary}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 border border-green-400/10 p-3 rounded-xl mb-4">
                  <div>
                    <span className="text-white/30 block">INSTALLED</span>
                    <span className="text-red-400">{dep.installedVersion}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block">FIXED IN</span>
                    <span className="text-green-400">{dep.fixedVersion}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-white/40">ACTION:</span>
                <code className="text-green-300/90 bg-green-500/10 px-2.5 py-1 rounded">
                  {dep.recommendation}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

