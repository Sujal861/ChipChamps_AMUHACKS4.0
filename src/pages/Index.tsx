import { useState, useEffect } from "react";
import URLChecker from "@/components/URLChecker";
import ResultCard from "@/components/ResultCard";
import HistoryList from "@/components/HistoryList";
import { URLCheckResult } from "@/types";
import { Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadHistory, clearHistory } from "@/lib/mockApi";

const Index = () => {
  const [result, setResult] = useState<URLCheckResult | null>(null);
  const [history, setHistory] = useState<URLCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const savedHistory = loadHistory();
    if (savedHistory && savedHistory.length > 0) {
      setHistory(savedHistory);
      setResult(savedHistory[0]);
    }
  }, []);

  const handleResultReceived = (newResult: URLCheckResult) => {
    setResult(newResult);
    setHistory((prev) => {
      const existingIndex = prev.findIndex(item => item.url === newResult.url);
      if (existingIndex !== -1) {
        const updatedHistory = [...prev];
        updatedHistory.splice(existingIndex, 1);
        return [newResult, ...updatedHistory];
      }
      return [newResult, ...prev.slice(0, 19)];
    });
  };

  const handleSelectHistoryItem = (selectedResult: URLCheckResult) => {
    setResult(selectedResult);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="relative mb-8 text-center">
          <div className="absolute right-4 top-0">
            <ThemeToggle />
          </div>
          
          <div className="flex items-center justify-center mb-4 animate-float">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-400">
            Web Watch Phish
          </h1>
          
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Check if a URL is legitimate or potentially malicious with our AI-powered phishing detection tool
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="transform transition-all duration-500 hover:scale-[1.02] glass-card rounded-xl p-1">
            <URLChecker
              onResultReceived={handleResultReceived}
              isChecking={isChecking}
              setIsChecking={setIsChecking}
            />
          </div>

          {result && (
            <div className="transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <ResultCard result={result} />
            </div>
          )}

          {history.length > 0 && (
            <div className="transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 delay-200">
              <HistoryList
                history={history}
                onSelectResult={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
              />
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Web Watch Phish uses advanced algorithms to analyze URLs for potential phishing threats.
            Always verify the authenticity of websites before sharing sensitive information.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Web Watch Phish. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
