
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { URLCheckResult } from "@/types";
import { Check, X, Shield, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

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
  
  return (
    <Card className="w-full shadow-lg border-t-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{ borderTopColor: isSafe ? '#38A169' : '#E53E3E' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Analysis Results</CardTitle>
          <Badge variant={isSafe ? "success" : "destructive"} className="ml-2">
            {isSafe ? (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Safe
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldX className="h-3.5 w-3.5 mr-1" />
                Potentially Unsafe
              </span>
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
              <span className={`text-sm font-bold ${getScoreColor()}`}>{scorePercentage}%</span>
            </div>
            <Progress value={scorePercentage} className="h-2" indicatorClassName={getProgressColor()} />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">URL Length</span>
              <Badge variant="outline">{features?.length} characters</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">HTTPS Protocol</span>
              {features?.hasHttps ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3.5 w-3.5 mr-1" /> Present
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <X className="h-3.5 w-3.5 mr-1" /> Missing
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Suspicious Keywords</span>
              {features?.hasSuspiciousKeywords ? (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Detected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3.5 w-3.5 mr-1" /> None Found
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Special Characters</span>
              <div className="flex gap-1">
                <Badge variant="outline">{features?.numDots} dots</Badge>
                <Badge variant="outline">{features?.numDashes} dashes</Badge>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-md bg-muted/50 text-sm">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
