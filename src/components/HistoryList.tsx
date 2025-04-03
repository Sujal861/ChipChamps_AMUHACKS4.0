
import { URLCheckResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldX, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface HistoryListProps {
  history: URLCheckResult[];
  onSelectResult: (result: URLCheckResult) => void;
  onClearHistory: () => void;
}

const HistoryList = ({ history, onSelectResult, onClearHistory }: HistoryListProps) => {
  if (history.length === 0) return null;
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Checks
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="h-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
              onClick={() => onSelectResult(item)}
            >
              {item.isSafe ? (
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium truncate">{item.url}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    item.isSafe
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {Math.round(item.score * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryList;
