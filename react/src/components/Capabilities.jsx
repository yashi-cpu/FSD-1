import React, { useState } from 'react';

const CAPABILITIES_DATA = [
  {
    num: "01",
    title: "Vulnerability\nDetection",
    summary: "Detect vulnerable patterns and potentially dangerous code in uploaded projects.",
    details: "Performs deep static analysis and AST checks covering SQLi, XSS, SSRF, command injection, secret leakage, and insecure deserialization across major languages."
  },
  {
    num: "02",
    title: "AI Risk\nAnalysis",
    summary: "Use machine learning to classify suspicious code patterns and estimate security risk.",
    details: "Utilizes deep learning models trained on millions of vulnerable and secure code pairs to compute accurate confidence metrics and risk prioritization."
  },
  {
    num: "03",
    title: "Clear Security\nReports",
    summary: "Turn technical findings into understandable reports with severity and recommendations.",
    details: "Generates actionable executive and developer reports with CVSS severity scoring, line-by-line attribution, and ready-to-merge remediation patches."
  }
];

export default function Capabilities({ showToast }) {
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (index) => {
    setExpandedCards((prev) => {
      const nextState = !prev[index];
      if (showToast) {
        showToast(
          '✨ Card Interaction (dblclick)',
          nextState
            ? `Expanded capability card 0${index + 1} details.`
            : `Collapsed capability card 0${index + 1}.`,
          2000
        );
      }
      return { ...prev, [index]: nextState };
    });
  };

  return (
    <section id="features" className="section py-32 px-8 md:px-20 relative">
      <div className="max-w-6xl mx-auto">
        <div className="eyebrow text-green-300/50 mb-7 font-mono">
          02 / CAPABILITIES
        </div>

        <h2 className="text-6xl md:text-8xl font-light tracking-[-.07em] leading-[.88]">
          Security built
          <br />
          around <span className="green">your code.</span>
        </h2>

        {/* CAPABILITY CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {CAPABILITIES_DATA.map((item, index) => {
            const isExpanded = !!expandedCards[index];
            return (
              <article
                key={item.num}
                onDoubleClick={() => toggleExpand(index)}
                className={`feature-card rounded-[25px] p-8 min-h-[320px] cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isExpanded ? 'card-expanded border-green-400/40 ring-1 ring-green-400/30' : ''
                }`}
                title="Double click to toggle technical details"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm green font-mono font-semibold">
                      {item.num}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">
                      {isExpanded ? 'DBLCLICK TO COLLAPSE' : 'DBLCLICK FOR SPECS'}
                    </span>
                  </div>

                  <h3 className="mt-12 text-3xl font-light whitespace-pre-line leading-tight text-white">
                    {item.title}
                  </h3>

                  <p className="mt-6 text-sm text-white/35 leading-6">
                    {item.summary}
                  </p>
                </div>

                <div
                  className={`card-expand-content overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'max-h-40 opacity-100 mt-6 pt-4 border-t border-green-400/20' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-xs font-mono text-green-300/80 leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

