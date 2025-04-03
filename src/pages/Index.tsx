
import { useState } from "react";
import URLChecker from "@/components/URLChecker";
import ResultCard from "@/components/ResultCard";
import HistoryList from "@/components/HistoryList";
import { URLCheckResult } from "@/types";
import { Shield } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<URLCheckResult | null>(null);
  const [history, setHistory] = useState<URLCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleResultReceived = (newResult: URLCheckResult) => {
    setResult(newResult);
    setHistory((prev) => [newResult, ...prev.slice(0, 9)]); // Keep only last 10 items
  };

  const handleSelectHistoryItem = (selectedResult: URLCheckResult) => {
    setResult(selectedResult);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Web Watch Phish
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Check if a URL is legitimate or potentially malicious with our AI-powered phishing detection tool
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          <URLChecker
            onResultReceived={handleResultReceived}
            isChecking={isChecking}
            setIsChecking={setIsChecking}
          />

          {result && <ResultCard result={result} />}

          {history.length > 0 && (
            <HistoryList
              history={history}
              onSelectResult={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
            />
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
