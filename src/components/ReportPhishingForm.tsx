
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { sendChromeMessage } from "@/lib/chromeUtils";
import { motion } from "framer-motion";

interface ReportPhishingFormProps {
  url: string;
}

const ReportPhishingForm = ({ url }: ReportPhishingFormProps) => {
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("No URL to report");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send report to background script
      const response = await sendChromeMessage({
        action: "reportPhishing",
        url,
        comments
      });
      
      if (response?.success) {
        setIsSubmitted(true);
        toast.success("Thank you for your report");
      } else {
        throw new Error("Failed to submit report");
      }
    } catch (error) {
      toast.error("Error submitting report: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <ThumbsUp className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your report helps make the web safer for everyone.
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800/50">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium">Report this URL as phishing</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Your report will help improve our detection system and protect other users.
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Additional comments (optional)"
            className="min-h-[80px] resize-none"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Report</span>
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ReportPhishingForm;
