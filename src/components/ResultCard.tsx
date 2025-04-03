
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { URLCheckResult } from "@/types";
import { Check, X, Shield, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  result: URLCheckResult | null;
}

const ResultCard = ({ result }: ResultCardProps) => {
  if (!result) return null;
  
  const { isSafe, score, url, features } = result;
  const scorePercentage = Math.round(score * 100);
  
  // Determine the color based on the score
  const getScoreColor = () => {
    if (scorePercentage > 80) return "text-green-500";
    if (scorePercentage > 50) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getProgressColor = () => {
    if (scorePercentage > 80) return "bg-green-500";
    if (scorePercentage > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <Card 
        className="w-full shadow-lg border-t-4 bg-gradient-to-br from-slate-50/90 to-slate-200/80 dark:from-slate-900/80 dark:to-slate-800/70 backdrop-blur-md transition-all duration-300 hover:shadow-xl"
        style={{ borderTopColor: isSafe ? '#38A169' : '#E53E3E' }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-300">Analysis Results</CardTitle>
            <Badge variant={isSafe ? "success" : "destructive"} className="ml-2 shadow-sm">
              {isSafe ? (
                <motion.span 
                  className="flex items-center gap-1"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut",
                    repeat: 2,
                    repeatType: "reverse"
                  }}
                >
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  Safe
                </motion.span>
              ) : (
                <motion.span 
                  className="flex items-center gap-1"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut",
                    repeat: 2,
                    repeatType: "reverse"
                  }}
                >
                  <ShieldX className="h-3.5 w-3.5 mr-1" />
                  Potentially Unsafe
                </motion.span>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 break-all">{url}</p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Safety Score</span>
                <motion.span 
                  className={`text-sm font-bold ${getScoreColor()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {scorePercentage}%
                </motion.span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Progress 
                  value={scorePercentage} 
                  className="h-2" 
                  indicatorClassName={getProgressColor()} 
                />
              </motion.div>
            </div>
            
            <Separator className="my-2 bg-slate-200 dark:bg-slate-700" />
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">URL Length</span>
                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 transition-colors">{features?.length} characters</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">HTTPS Protocol</span>
                {features?.hasHttps ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50 transition-colors">
                    <Check className="h-3.5 w-3.5 mr-1" /> Present
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50 transition-colors">
                    <X className="h-3.5 w-3.5 mr-1" /> Missing
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Suspicious Keywords</span>
                {features?.hasSuspiciousKeywords ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50 transition-colors">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Detected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50 transition-colors">
                    <Check className="h-3.5 w-3.5 mr-1" /> None Found
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Special Characters</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 transition-colors">{features?.numDots} dots</Badge>
                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 transition-colors">{features?.numDashes} dashes</Badge>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="p-3 rounded-md bg-muted/50 text-sm dark:bg-slate-800/50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {isSafe ? (
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>This URL appears to be safe based on our analysis. However, always exercise caution when clicking on unfamiliar links.</p>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p>This URL shows characteristics commonly associated with phishing attempts. We recommend avoiding this website.</p>
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
