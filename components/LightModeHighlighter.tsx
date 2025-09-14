// components/LightModeHighlighter.tsx
"use client";
import { codeToHtml } from 'shiki';
import { useEffect, useState } from 'react';

export function LightModeHighlighter({ code }: { code: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    async function highlight() {
      const highlighted = await codeToHtml(code, { 
        lang: 'html', 
        theme: 'github-light' 
      });
      // This is the fix to remove the white background rectangle
      const transparentHtml = highlighted.replace(/background-color:.*?;/, '');
      setHtml(transparentHtml);
    }
    highlight();
  }, [code]);

  if (!html) return <div className="flex-grow rounded-md border border-slate-300 bg-slate-100 animate-pulse" />;
  
  return <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!h-full [&>pre]:!p-4 [&>pre]:!font-mono" />;
}