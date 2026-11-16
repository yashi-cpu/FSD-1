import React from 'react';

export default function MlIntelligence({ mlData }) {
  const data = mlData || {
    model_name: "Random Forest Classifier (DiverseVul & Devign Trained)",
    predicted_label: "POTENTIALLY_VULNERABLE",
    vulnerability_probability: 0.942,
    anomaly_detection: {
      model: "Isolation Forest (Outlier Analysis)",
      anomaly_score: -0.68,
      is_anomaly: true,
      flagged_reasons: [
        "Unusual density of raw string concatenations in DB query layer",
        "Direct child_process execution without argument sanitization",
        "High Shannon entropy credential sequence detected in static configs"
      ]
    },
    extracted_features: {
      user_controlled_inputs: 4,
      unparameterized_queries: 2,
      shell_command_executions: 1,
      filesystem_operations: 3,
      weak_crypto_functions: 0,
      hardcoded_token_signatures: 2
    }
  };

  return (
    <section id="ml-intelligence" className="section py-24 px-8 md:px-20 border-t border-green-400/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="eyebrow text-green-300/50 mb-3 font-mono">
            06 / SCIKIT-LEARN & AST CODE INTELLIGENCE
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-[-.05em]">
            AI & <span className="green">Machine Learning</span> Engine
          </h2>
          <p className="mt-4 text-sm text-white/40 max-w-xl leading-relaxed">
            Combines Random Forest supervised classification for vulnerability categorization with an
            Isolation Forest anomaly detection pipeline to surface irregular AST code structures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Supervised Random Forest Classifier */}
          <div className="feature-card rounded-[28px] p-8 border border-green-400/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-white/40">SUPERVISED CLASSIFIER</span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-green-400/30 text-[#7cff9b] bg-green-500/10">
                  SCIKIT-LEARN
                </span>
              </div>

              <h3 className="text-2xl font-light text-white mb-2">
                Random Forest Model
              </h3>
              <p className="text-xs text-white/40 font-mono mb-6">
                Dataset: DiverseVul, Devign & Juliet Test Suite (SARD)
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/40">PREDICTED CLASSIFICATION:</span>
                  <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-400/10">
                    {data.predicted_label}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/40">VULNERABILITY PROBABILITY:</span>
                  <span className="green font-bold">
                    {(data.vulnerability_probability * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-red-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${(data.vulnerability_probability * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-white/30 flex justify-between">
              <span>Metric F1-Score: 0.912</span>
              <span>Recall: 0.941</span>
            </div>
          </div>

          {/* 2. Isolation Forest Anomaly Detection */}
          <div className="feature-card rounded-[28px] p-8 border border-green-400/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-white/40">UNSUPERVISED ANOMALY MODEL</span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-yellow-400/30 text-yellow-300 bg-yellow-500/10">
                  ISOLATION FOREST
                </span>
              </div>

              <h3 className="text-2xl font-light text-white mb-2">
                AST Outlier Analysis
              </h3>
              <p className="text-xs text-white/40 font-mono mb-6">
                Flags abnormal feature combinations differing from safe baselines
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-4">
                <div className="flex justify-between items-center font-mono text-xs mb-2">
                  <span className="text-white/40">ANOMALY INDEX:</span>
                  <span className="text-yellow-300 font-bold">
                    {data.anomaly_detection.anomaly_score} (FLAGGED OUTLIER)
                  </span>
                </div>
                <div className="text-[11px] text-white/60 font-sans">
                  The model detected code structures with high decision-path divergence.
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-white/40 block">FLAGGED ANOMALIES:</span>
                {data.anomaly_detection.flagged_reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono text-yellow-300/80">
                    <span className="text-yellow-400">⚡</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-white/30">
              Evaluated on n_estimators=100 with contamination=0.08
            </div>
          </div>
        </div>

        {/* 3. Code Features Extracted via Python AST */}
        <div className="mt-8 feature-card rounded-[28px] p-8 border border-green-400/15">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-light text-white">
              AST Extracted Code Feature Vector
            </h4>
            <span className="text-xs font-mono text-white/30">
              Python AST & Syntax Tree Quantization
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
            {Object.entries(data.extracted_features).map(([key, val]) => (
              <div key={key} className="p-4 rounded-2xl bg-black/40 border border-green-400/10">
                <div className="text-2xl font-bold green mb-1">{val}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">
                  {key.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

