
import React from 'react';
import { AnalysisResult, ErrorType, Correction } from '../types';

interface Props {
  originalText: string;
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

const typeStyles: Record<ErrorType, { bg: string; border: string; label: string; text: string }> = {
  [ErrorType.CASING]: { bg: 'bg-yellow-100', border: 'border-yellow-400', label: 'Casing', text: 'text-yellow-800' },
  [ErrorType.GRAMMAR]: { bg: 'bg-red-100', border: 'border-red-400', label: 'Grammar', text: 'text-red-800' },
  [ErrorType.PUNCTUATION]: { bg: 'bg-blue-100', border: 'border-blue-400', label: 'Punctuation', text: 'text-blue-800' },
  [ErrorType.SPELLING]: { bg: 'bg-orange-100', border: 'border-orange-400', label: 'Spelling', text: 'text-orange-800' },
};

export const CorrectionDisplay: React.FC<Props> = ({ originalText, analysis, isLoading }) => {
  if (isLoading && !analysis) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-6">
        <div className="h-6 bg-gray-100 rounded w-1/4"></div>
        <div className="h-24 bg-gray-50 rounded-xl"></div>
        <div className="h-24 bg-gray-50 rounded-xl"></div>
      </div>
    );
  }

  if (!analysis || !originalText) return null;

  const renderHighlightedText = () => {
    if (analysis.isClean || analysis.corrections.length === 0) {
      return <p className="text-gray-600 leading-relaxed font-medium">Your text is grammatically sound!</p>;
    }

    const sortedCorrections = [...analysis.corrections].sort((a, b) => a.startIndex - b.startIndex);
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedCorrections.forEach((corr, idx) => {
      if (corr.startIndex > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{originalText.substring(lastIndex, corr.startIndex)}</span>);
      }
      const style = typeStyles[corr.type];
      parts.push(
        <span
          key={`corr-${idx}`}
          className={`${style.bg} ${style.text} border-b-2 ${style.border} font-bold px-1 rounded-sm cursor-help transition-colors hover:brightness-95`}
          title={corr.explanation}
        >
          {originalText.substring(corr.startIndex, corr.endIndex)}
        </span>
      );
      lastIndex = corr.endIndex;
    });

    if (lastIndex < originalText.length) {
      parts.push(<span key="text-last">{originalText.substring(lastIndex)}</span>);
    }

    return <div className="text-gray-800 leading-relaxed text-lg">{parts}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Analysis & Corrections</h3>
            {analysis.isClean ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-tighter">PRISTINE</span>
            ) : (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                {analysis.corrections.length} IMPROVEMENT{analysis.corrections.length === 1 ? '' : 'S'}
              </span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase">ORIGINAL FEEDBACK</label>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            {renderHighlightedText()}
          </div>
        </div>

        {!analysis.isClean && (
          <div className="mb-8 group">
            <label className="block text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase">PROPER VERSION</label>
            <div className="relative p-6 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100 font-bold text-lg leading-relaxed shadow-inner">
              {analysis.correctedText}
              <button 
                onClick={() => navigator.clipboard.writeText(analysis.correctedText)}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-lg shadow-sm text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                title="Copy corrected text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>
        )}

        {analysis.corrections.length > 0 && (
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">CORRECTION DETAILS</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.corrections.map((corr, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 border-l-4 rounded-r-xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col ${typeStyles[corr.type].border}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${typeStyles[corr.type].bg} ${typeStyles[corr.type].text}`}>
                      {typeStyles[corr.type].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mb-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-red-500 line-through text-sm font-bold opacity-60">{corr.originalPart}</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-green-600 font-black text-sm">{corr.replacementPart}</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium">
                    {corr.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
