
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, Trash2, RefreshCw, Key, Lock, CloudOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { toggleCyberShieldPro, getCyberShieldProSubscription } from "@/lib/mockApi";

interface SettingsPanelProps {
  onClearHistory: () => void;
}

const SettingsPanel = ({ onClearHistory }: SettingsPanelProps) => {
  const [autoScan, setAutoScan] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [scanFrequency, setScanFrequency] = useState("always");
  const [apiPreference, setApiPreference] = useState("both");
  const [isLoading, setIsLoading] = useState(false);
  const [cyberShieldActive, setCyberShieldActive] = useState(getCyberShieldProSubscription().isActive);
  
  const handleClearHistory = () => {
    onClearHistory();
  };
  
  const handleSettingChange = (setting: string, value: boolean | string) => {
    // Simulate saving settings
    setIsLoading(true);
    setTimeout(() => {
      switch (setting) {
        case "autoScan":
          setAutoScan(value as boolean);
          toast.success(`Auto-scan ${value ? "enabled" : "disabled"}`);
          break;
        case "notifications":
          setNotificationsEnabled(value as boolean);
          toast.success(`Notifications ${value ? "enabled" : "disabled"}`);
          break;
        case "privacy":
          setPrivacyMode(value as boolean);
          toast.success(`Privacy mode ${value ? "enabled" : "disabled"}`);
          break;
        case "scanFrequency":
          setScanFrequency(value as string);
          toast.success(`Scan frequency set to ${value}`);
          break;
        case "apiPreference":
          setApiPreference(value as string);
          toast.success(`API preference updated`);
          break;
      }
      setIsLoading(false);
    }, 500);
  };
  
  const handleToggleCyberShieldPro = async () => {
    setIsLoading(true);
    try {
      const result = await toggleCyberShieldPro();
      setCyberShieldActive(result.active);
      toast.success(result.message);
    } catch (error) {
      toast.error("Error toggling CyberShield Pro status");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/70 text-white shadow-lg backdrop-blur-md border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl text-white">Settings</CardTitle>
        <CardDescription className="text-white/70">
          Configure your phishing protection preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-indigo-900/50 to-indigo-800/30 p-4 rounded-lg border border-indigo-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-900/80 rounded-md">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">CyberShield Pro</h3>
                <p className="text-sm text-white/70">Advanced protection with AI-powered analysis</p>
              </div>
            </div>
            <Switch
              checked={cyberShieldActive}
              onCheckedChange={handleToggleCyberShieldPro}
              disabled={isLoading}
              className="data-[state=checked]:bg-indigo-600"
            />
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="p-2 bg-black/20 rounded-md text-center">
              <p className="text-xs text-white/60">Behavioral Analysis</p>
              <p className={`text-sm font-medium ${cyberShieldActive ? "text-green-400" : "text-white/40"}`}>
                {cyberShieldActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="p-2 bg-black/20 rounded-md text-center">
              <p className="text-xs text-white/60">Link Inspection</p>
              <p className={`text-sm font-medium ${cyberShieldActive ? "text-green-400" : "text-white/40"}`}>
                {cyberShieldActive ? "Deep Scan" : "Basic"}
              </p>
            </div>
            <div className="p-2 bg-black/20 rounded-md text-center">
              <p className="text-xs text-white/60">Alert System</p>
              <p className={`text-sm font-medium ${cyberShieldActive ? "text-green-400" : "text-white/40"}`}>
                {cyberShieldActive ? "Advanced" : "Basic"}
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="auto-scan" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-white/70" />
                Auto-scan websites
              </Label>
              <p className="text-xs text-white/60">Automatically scan websites when you visit them</p>
            </div>
            <Switch
              id="auto-scan"
              checked={autoScan}
              onCheckedChange={(checked) => handleSettingChange("autoScan", checked)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white/70" />
                Notifications
              </Label>
              <p className="text-xs text-white/60">Show notifications for scan results</p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label htmlFor="privacy-mode" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-white/70" />
                Privacy Mode
              </Label>
              <p className="text-xs text-white/60">Don't store history of scanned URLs</p>
            </div>
            <Switch
              id="privacy-mode"
              checked={privacyMode}
              onCheckedChange={(checked) => handleSettingChange("privacy", checked)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="scan-frequency" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-white/70" />
              Scan Frequency
            </Label>
            <Select 
              value={scanFrequency}
              onValueChange={(value) => handleSettingChange("scanFrequency", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Every Page Visit</SelectItem>
                <SelectItem value="hourly">Once per hour</SelectItem>
                <SelectItem value="daily">Once per day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-1">
            <Label htmlFor="api-preference" className="flex items-center gap-2">
              <Key className="h-4 w-4 text-white/70" />
              Threat API Preference
            </Label>
            <Select 
              value={apiPreference}
              onValueChange={(value) => handleSettingChange("apiPreference", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20">
                <SelectValue placeholder="Select API preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="googleSafeBrowsing">Google Safe Browsing</SelectItem>
                <SelectItem value="openPhish">OpenPhish Database</SelectItem>
                <SelectItem value="both">Both APIs (Recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleClearHistory}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              className="w-full dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10" 
              disabled={isLoading}
            >
              <CloudOff className="h-4 w-4 mr-2" />
              Reset All Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
