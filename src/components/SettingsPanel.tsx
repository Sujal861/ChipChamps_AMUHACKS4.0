
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Cog, Moon, RotateCcw, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { sendChromeMessage } from "@/lib/chromeUtils";
import { clearHistory } from "@/lib/mockApi";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface SettingsPanelProps {
  onClearHistory: () => void;
}

const SettingsPanel = ({ onClearHistory }: SettingsPanelProps) => {
  const [autoScan, setAutoScan] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await sendChromeMessage({ action: "getSettings" });
        
        if (settings) {
          setAutoScan(settings.autoScanEnabled ?? true);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleAutoScanToggle = async (enabled: boolean) => {
    setAutoScan(enabled);
    
    try {
      await sendChromeMessage({
        action: "toggleAutoScan",
        enabled
      });
      
      toast.success(`Auto-scanning ${enabled ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update settings");
      // Revert UI state on error
      setAutoScan(!enabled);
    }
  };
  
  const handleClearHistory = () => {
    clearHistory();
    onClearHistory();
    toast.success("History cleared");
  };
  
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-lg bg-gradient-to-br from-slate-50/90 to-slate-200/80 dark:from-slate-900/80 dark:to-slate-800/70 backdrop-blur-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Cog className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Settings</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="auto-scan" className="font-medium">Auto-Scan Active Tabs</Label>
                      <p className="text-sm text-muted-foreground">Automatically check URLs as you browse</p>
                    </div>
                  </div>
                  <Switch 
                    id="auto-scan" 
                    checked={autoScan} 
                    onCheckedChange={handleAutoScanToggle}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                      <Moon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle dark/light appearance</p>
                    </div>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={theme === "dark"} 
                    onCheckedChange={handleToggleTheme}
                  />
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full flex items-center gap-2 mt-2"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Browsing History
                </Button>
              </div>
              
              <div className="rounded-md bg-muted/50 p-3 text-sm flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Web Watch Phish v1.0.0
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      AI Protection
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Blacklist Integration
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Auto-Scanning
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPanel;
