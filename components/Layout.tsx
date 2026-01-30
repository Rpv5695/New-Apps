
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Linguist<span className="text-indigo-600">Pro</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Your real-time writing companion. We detect casing, grammar, and punctuation slips so you don't have to.
          </p>
        </div>
        {children}
      </div>
      <footer className="mt-12 text-gray-400 text-sm">
        Powered by Gemini 3 Flash • Professional Grammar AI
      </footer>
    </div>
  );
};
