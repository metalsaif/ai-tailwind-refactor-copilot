"use client";

import { useState } from "react";
import { TipDisplay } from "@/components/TipDisplay";
import { ConvertButton } from "@/components/ConvertButton";
import { Footer } from "@/components/Footer";
import { InputArea } from "@/components/InputArea";
import { OutputArea } from "@/components/OutputArea";
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import prettier from "prettier/standalone";
import * as prettierPluginHtml from "prettier/plugins/html";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tip, setTip] = useState("");

  const [loadingMessage, setLoadingMessage] = useState("Convert to Tailwind CSS");

  const handleClear = () => {
    setInputCode("");
    setOutputCode("");
    setTip("");
  };

   const handleConvert = async () => {
    setIsLoading(true);
    setOutputCode("");
    setTip("");
    setLoadingMessage("Waking up the AI server..."); // Initial message 

    try {
      const response = await fetch("/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inputCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setOutputCode(`Error: ${errorData.error || "Something went wrong."}`);
        setTip("The server returned an error. Please try again.");
        return;
      }

      const data = await response.json();
      setOutputCode(data.refactoredCode);
      setTip(data.tip);

    } catch (error) {
      console.error("Failed to fetch:", error);
      setOutputCode("Error: Failed to connect to the server.");
      setTip("Could not reach the server. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-200 transition-colors">
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeSwitcher />
      </header>
       <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col">
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Tailwind Refactor Copilot!
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto dark:text-slate-300">
            Paste your messy HTML or CSS, and let our AI refactor it into clean, best-practice Tailwind CSS code.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 flex-grow">
          <InputArea value={inputCode} onChange={setInputCode} />
          <OutputArea value={outputCode} />
        </div>
        <TipDisplay tip={tip} />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ConvertButton 
            onClick={handleConvert} 
            isLoading={isLoading} 
            loadingMessage={loadingMessage} 
          />

          {(inputCode || outputCode) && (
            <button
              onClick={handleClear}
              className="px-8 py-3 font-semibold rounded-md text-blue-600 dark:text-slate-300 bg-blue-100 dark:bg-slate-700 hover:bg-blue-200 dark:hover:bg-slate-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}