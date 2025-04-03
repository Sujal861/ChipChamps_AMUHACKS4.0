
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { checkURL } from "@/lib/mockApi";
import { URLCheckResult } from "@/types";
import { AlertTriangle, Shield, Link2 } from "lucide-react";

interface URLCheckerProps {
  onResultReceived: (result: URLCheckResult) => void;
  isChecking: boolean;
  setIsChecking: (isChecking: boolean) => void;
}

const URLChecker = ({ onResultReceived, isChecking, setIsChecking }: URLCheckerProps) => {
  const [url, setUrl] = useState("");
  
  const validateURL = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if URL is empty
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    // Prepend http if protocol is missing
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = 'http://' + url;
    }
    
    // Validate URL format
    if (!validateURL(processedUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    try {
      setIsChecking(true);
      const result = await checkURL(processedUrl);
      onResultReceived(result);
      toast.success("URL check completed");
      setUrl("");
    } catch (error) {
      toast.error("Error checking URL: " + (error as Error).message);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl shadow-lg bg-gradient-to-br from-slate-50/90 to-slate-200/80 dark:from-slate-900/80 dark:to-slate-800/70 backdrop-blur-md transition-all duration-300">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-500">Check URL Safety</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow group">
              <Input
                type="text"
                placeholder="Enter URL to check (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pr-10 border-slate-300 dark:border-slate-700 transition-all duration-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 group-hover:border-blue-300 dark:group-hover:border-blue-600"
                disabled={isChecking}
              />
              {isChecking && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isChecking} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 dark:from-blue-600 dark:to-blue-800 transition-all duration-300 hover:shadow-lg"
            >
              {isChecking ? "Analyzing..." : "Check URL"}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2 dark:text-slate-400">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p>Enter any URL to check if it's potentially malicious</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default URLChecker;
