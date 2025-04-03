
import { useState, useEffect } from "react";
import URLChecker from "@/components/URLChecker";
import ResultCard from "@/components/ResultCard";
import HistoryList from "@/components/HistoryList";
import SettingsPanel from "@/components/SettingsPanel";
import { URLCheckResult } from "@/types";
import { Shield, Cog } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadHistory, clearHistory } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { getCurrentTabUrl, getActiveTabInfo, isExtension } from "@/lib/chromeUtils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Index = () => {
  const [result, setResult] = useState<URLCheckResult | null>(null);
  const [history, setHistory] = useState<URLCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabInfo, setTabInfo] = useState<{ url: string; title: string; favIconUrl: string } | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const loadHistoryData = () => {
      const savedHistory = loadHistory();
      if (savedHistory && savedHistory.length > 0) {
        setHistory(savedHistory);
        setResult(savedHistory[0]);
      }
    };
    
    const checkActiveTab = async () => {
      try {
        const url = await getCurrentTabUrl();
        if (url) {
          setActiveTab(url);
        }
        
        const info = await getActiveTabInfo();
        if (info) {
          setTabInfo(info);
        }
      } catch (error) {
        console.error("Error getting active tab:", error);
      }
    };
    
    loadHistoryData();
    
    if (isExtension()) {
      checkActiveTab();
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
    toast.success("History cleared successfully");
  };
  
  const handleCheckCurrentTab = async () => {
    if (!activeTab) {
      toast.error("No active tab detected");
      return;
    }
    
    // Set this in the URL checker component
    // and trigger the check
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="relative mb-8 text-center">
          <div className="absolute right-4 top-0">
            <ThemeToggle />
          </div>
          
          <motion.div 
            className="flex items-center justify-center mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="h-12 w-12 text-primary animate-float" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-400"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Web Watch Phish
          </motion.h1>
          
          <motion.p 
            className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Advanced AI-powered phishing detection with real-time tab monitoring
          </motion.p>
          
          {isExtension() && tabInfo && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span>Currently browsing:</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                {tabInfo.favIconUrl && (
                  <img src={tabInfo.favIconUrl} alt="" className="w-4 h-4" />
                )}
                <span className="font-medium truncate max-w-xs">{tabInfo.title || tabInfo.url}</span>
              </div>
            </motion.div>
          )}
        </header>

        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="transform transition-all duration-500 hover:scale-[1.02] glass-card rounded-xl p-1">
            <URLChecker
              onResultReceived={handleResultReceived}
              isChecking={isChecking}
              setIsChecking={setIsChecking}
              activeTabUrl={activeTab}
            />
          </motion.div>

          {result && (
            <motion.div variants={itemVariants} className="transform transition-all duration-500">
              <ResultCard result={result} />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="transform transition-all duration-500">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="mt-0">
                {history.length > 0 ? (
                  <HistoryList
                    history={history}
                    onSelectResult={handleSelectHistoryItem}
                    onClearHistory={handleClearHistory}
                  />
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-lg border border-border">
                    <p className="text-muted-foreground">No history yet. Check some URLs to build history.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <SettingsPanel onClearHistory={handleClearHistory} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Web Watch Phish uses advanced AI algorithms to analyze URLs for potential phishing threats.
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
