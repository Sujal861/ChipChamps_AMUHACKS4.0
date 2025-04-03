
import { URLCheckResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldX, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface HistoryListProps {
  history: URLCheckResult[];
  onSelectResult: (result: URLCheckResult) => void;
  onClearHistory: () => void;
}

const HistoryList = ({ history, onSelectResult, onClearHistory }: HistoryListProps) => {
  if (history.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full shadow-lg bg-gradient-to-br from-slate-50/90 to-slate-200/80 dark:from-slate-900/80 dark:to-slate-800/70 backdrop-blur-md transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-300">Recent Checks</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="h-8 text-muted-foreground hover:text-destructive transition-colors duration-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {history.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer group"
                onClick={() => onSelectResult(item)}
              >
                {item.isSafe ? (
                  <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {item.url}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.isSafe
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                    } transition-colors duration-200`}
                  >
                    {Math.round(item.score * 100)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HistoryList;
