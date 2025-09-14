// components/OutputArea.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { DarkModeHighlighter } from './DarkModeHighlighter';
import { LightModeHighlighter } from './LightModeHighlighter';

interface OutputAreaProps {
  value: string;
}

export function OutputArea({ value }: OutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const codeToDisplay = value || "Your clean code will appear here...";

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.innerText;
      navigator.clipboard.writeText(text);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="relative flex flex-col h-full">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Generated Tailwind Code
      </label>
      <div 
        ref={codeRef}
        className="flex-grow overflow-auto rounded-md border border-slate-300 dark:border-slate-700 text-sm"
      >
        {/* The light mode version is hidden when in dark mode */}
        <div className="dark:hidden h-full">
          <LightModeHighlighter code={codeToDisplay} />
        </div>
        {/* The dark mode version is hidden by default, and shown only in dark mode */}
        <div className="hidden dark:block h-full">
          <DarkModeHighlighter code={codeToDisplay} />
        </div>
      </div>

      {value && (
        <button
          onClick={handleCopy}
          className="absolute top-9 right-3 px-3 py-1.5 text-xs font-semibold..."
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}