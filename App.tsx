
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { CorrectionDisplay } from './components/CorrectionDisplay';
import { RefinedVersions } from './components/RefinedVersions';
import { analyzeText } from './services/geminiService';
import { AnalysisResult } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedText, setDebouncedText] = useState('');

  // Reduced debounce to 500ms for faster perceived responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleAnalysis = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setAnalysis(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await analyzeText(text);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedText) {
      handleAnalysis(debouncedText);
    } else {
      setAnalysis(null);
    }
  }, [debouncedText, handleAnalysis]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const clearText = () => {
    setInputText('');
    setAnalysis(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="relative bg-white rounded-2xl shadow-xl border-2 border-transparent focus-within:border-indigo-100 overflow-hidden transition-all">
          <textarea
            className="w-full h-56 p-8 text-gray-900 text-xl font-medium placeholder-gray-300 border-none focus:ring-0 outline-none resize-none transition-all leading-relaxed"
            placeholder="Type your sentence here..."
            value={inputText}
            onChange={handleInputChange}
            spellCheck={false}
          />
          
          <div className="absolute bottom-6 right-6 flex items-center space-x-4">
            {inputText && (
              <button
                onClick={clearText}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                Clear All
              </button>
            )}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold tracking-tight ${isLoading ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {isLoading ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                  <span>REFINING...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>LIVE SYNC</span>
                </>
              )}
            </div>
          </div>
        </div>

        <RefinedVersions 
          analysis={analysis} 
          isLoading={isLoading} 
        />

        <CorrectionDisplay 
          originalText={debouncedText} 
          analysis={analysis} 
          isLoading={isLoading} 
        />
        
        {(!inputText && !isLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl">Aa</div>
              <h4 className="font-bold text-gray-800">Casing Fixer</h4>
              <p className="text-sm text-gray-500">Intelligent sentence case correction for professional documents.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl">✓</div>
              <h4 className="font-bold text-gray-800">Style Switcher</h4>
              <p className="text-sm text-gray-500">Instantly swap between Professional, Concise, and Creative tones.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl">💡</div>
              <h4 className="font-bold text-gray-800">Smart Logic</h4>
              <p className="text-sm text-gray-500">Context-aware grammar checks powered by Gemini 3 Flash.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
