
import React, { useState } from "react";
import { URLCheckResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThreatLevelIndicator from "@/components/ThreatLevelIndicator";
import { motion } from "framer-motion";
import { Info, ShieldAlert, ShieldCheck, Link, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportPhishingForm } from "./ReportPhishingForm";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProResultDetails from "./ProResultDetails";

interface ResultCardProps {
  result: URLCheckResult;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString();
};

const ResultCard = ({ result }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const renderFeatureBadge = (
    feature: string,
    value: boolean | number | undefined,
    goodValue: boolean | number = true
  ) => {
    if (value === undefined) return null;
    
    const isGood = value === goodValue;
    const colorClass = isGood ? 
      "bg-green-500/30 text-green-200 dark:bg-green-900/40 dark:text-green-300" : 
      "bg-red-500/30 text-red-200 dark:bg-red-900/40 dark:text-red-300";
    
    return (
      <Badge className={`${colorClass}`}>
        {feature}
      </Badge>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card rounded-xl p-1"
    >
      <Card className="bg-gradient-to-br from-slate-50/90 to-slate-200/80 dark:from-slate-900/80 dark:to-slate-800/70 backdrop-blur-md shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {result.isSafe ? (
                <ShieldCheck className="h-5 w-5 text-green-500" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-500" />
              )}
              <span className={result.isSafe ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                {result.isSafe ? "Safe to proceed" : "Potential threat detected"}
              </span>
            </div>
            
            {result.inBlacklist && (
              <Badge variant="destructive" className="ml-2">Blacklisted</Badge>
            )}
            
            {result.proData && (
              <Badge variant="outline" className="ml-2 bg-indigo-500/20 text-indigo-200 border-indigo-500/30">
                CyberShield Pro
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <motion.div variants={itemVariants} className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-md overflow-hidden">
            <Link className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm truncate hover:underline">
              {result.url}
            </a>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ThreatLevelIndicator level={result.threatLevel || "safe"} score={result.score} />
          </motion.div>
          
          {/* Show Pro Results if available */}
          {result.proData && (
            <ProResultDetails result={result} />
          )}
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col space-y-4"
          >
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-sm" 
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>{showDetails ? "Hide Details" : "Show Details"}</span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
              </Button>
            </div>
            
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Info className="h-4 w-4" /> Analysis Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Scan Time:</p>
                        <p>{formatDate(result.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence:</p>
                        <p>{result.confidenceScore ? `${Math.round(result.confidenceScore * 100)}%` : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">URL Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.features?.hasHttps !== undefined && renderFeatureBadge("HTTPS", result.features.hasHttps)}
                      {result.features?.hasIpAddress !== undefined && renderFeatureBadge("IP Address", result.features.hasIpAddress, false)}
                      {result.features?.hasExcessiveSubdomains !== undefined && renderFeatureBadge("Many Subdomains", result.features.hasExcessiveSubdomains, false)}
                      {result.features?.hasSuspiciousKeywords !== undefined && renderFeatureBadge("Suspicious Keywords", result.features.hasSuspiciousKeywords, false)}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        Report this URL as phishing
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report Phishing URL</DialogTitle>
                      </DialogHeader>
                      <ReportPhishingForm url={result.url} />
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
