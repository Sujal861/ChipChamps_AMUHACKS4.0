
import React from "react";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type ThreatLevel = "safe" | "low" | "medium" | "high";

interface ThreatLevelIndicatorProps {
  level: ThreatLevel;
  score: number;
}

const ThreatLevelIndicator = ({ level, score }: ThreatLevelIndicatorProps) => {
  // Normalize score to percentage
  const scorePercentage = Math.min(Math.max(Math.round(score * 100), 0), 100);
  
  const getColorClass = (): string => {
    switch (level) {
      case "safe": return "bg-green-500";
      case "low": return "bg-yellow-400";
      case "medium": return "bg-orange-500";
      case "high": return "bg-red-600";
      default: return "bg-gray-400";
    }
  };
  
  const getBackgroundClass = (): string => {
    switch (level) {
      case "safe": return "from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20";
      case "low": return "from-yellow-100 to-yellow-50 dark:from-yellow-950/30 dark:to-yellow-900/20";
      case "medium": return "from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/20";
      case "high": return "from-red-100 to-red-50 dark:from-red-950/30 dark:to-red-900/20";
      default: return "from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-700/20";
    }
  };
  
  const getIcon = () => {
    switch (level) {
      case "safe":
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case "low":
        return <Shield className="h-5 w-5 text-yellow-400" />;
      case "medium":
        return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case "high":
        return <ShieldX className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getBadgeText = (): string => {
    switch (level) {
      case "safe": return "Safe";
      case "low": return "Low Risk";
      case "medium": return "Medium Risk";
      case "high": return "High Risk";
      default: return "Unknown";
    }
  };
  
  return (
    <motion.div 
      className={`p-3 rounded-lg bg-gradient-to-br ${getBackgroundClass()} border dark:border-white/10 shadow-sm`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-medium">Threat Level</h3>
        </div>
        <Badge 
          className={`${level === "safe" ? "bg-green-500" : level === "low" ? "bg-yellow-400" : level === "medium" ? "bg-orange-500" : "bg-red-600"} text-white`}
        >
          {getBadgeText()}
        </Badge>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-muted-foreground">Safe</span>
          <span className="text-xs text-muted-foreground">Dangerous</span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Progress 
            value={scorePercentage} 
            className="h-2 bg-gray-200 dark:bg-gray-700" 
            indicatorClassName={getColorClass()} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ThreatLevelIndicator;
