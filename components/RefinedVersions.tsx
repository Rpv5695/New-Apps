
import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

export const RefinedVersions: React.FC<Props> = ({ analysis, isLoading }) => {
  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
    </div>
  );

  if (!analysis || !analysis.refinedVersions) return null;

  const versions = [
    { label: 'Professional', text: analysis.refinedVersions.professional, icon: '💼', color: 'indigo' },
    { label: 'Concise', text: analysis.refinedVersions.concise, icon: '⚡', color: 'emerald' },
    { label: 'Creative', text: analysis.refinedVersions.creative, icon: '✨', color: 'amber' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Refined Variations</h3>
        <div className="h-px flex-1 bg-gray-100"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {versions.map((v, idx) => (
          <div key={idx} className="group relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">{v.icon}</span>
              <span className={`text-xs font-bold uppercase tracking-wider text-${v.color}-600`}>{v.label}</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed font-medium">
              {v.text}
            </p>
            <button 
              onClick={() => navigator.clipboard.writeText(v.text)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-50 rounded-md transition-all text-gray-400 hover:text-indigo-600"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
