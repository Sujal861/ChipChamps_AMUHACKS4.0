
// Types for alerting system
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  timestamp: Date;
  sourceUrl?: string;
  sourceType: "url_check" | "behavioral_analysis" | "system";
  status: "new" | "acknowledged" | "resolved" | "false_positive";
  assignedTo?: string;
  metadata?: Record<string, any>;
}

// Generate a unique ID
const generateAlertId = (): string => {
  return 'alert_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// In-memory alert storage (would be a database in a real implementation)
let alerts: Alert[] = [];

// Create a new alert
export const createAlert = (
  title: string,
  message: string,
  severity: Alert["severity"],
  sourceType: Alert["sourceType"],
  sourceUrl?: string,
  metadata?: Record<string, any>
): Alert => {
  const newAlert: Alert = {
    id: generateAlertId(),
    title,
    message,
    severity,
    timestamp: new Date(),
    sourceType,
    sourceUrl,
    status: "new",
    metadata
  };
  
  alerts.push(newAlert);
  return newAlert;
};

// Get all alerts with optional filtering
export const getAlerts = (options?: {
  status?: Alert["status"];
  severity?: Alert["severity"];
  sourceType?: Alert["sourceType"];
  limit?: number;
}): Alert[] => {
  let filteredAlerts = [...alerts];
  
  if (options?.status) {
    filteredAlerts = filteredAlerts.filter(a => a.status === options.status);
  }
  
  if (options?.severity) {
    filteredAlerts = filteredAlerts.filter(a => a.severity === options.severity);
  }
  
  if (options?.sourceType) {
    filteredAlerts = filteredAlerts.filter(a => a.sourceType === options.sourceType);
  }
  
  // Sort by timestamp (newest first)
  filteredAlerts = filteredAlerts.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  // Apply limit if specified
  if (options?.limit) {
    filteredAlerts = filteredAlerts.slice(0, options.limit);
  }
  
  return filteredAlerts;
};

// Update an alert's status
export const updateAlertStatus = (
  id: string,
  status: Alert["status"],
  assignedTo?: string
): Alert | null => {
  const alertIndex = alerts.findIndex(a => a.id === id);
  if (alertIndex === -1) return null;
  
  alerts[alertIndex] = {
    ...alerts[alertIndex],
    status,
    assignedTo: assignedTo || alerts[alertIndex].assignedTo
  };
  
  return alerts[alertIndex];
};

// Delete an alert
export const deleteAlert = (id: string): boolean => {
  const initialLength = alerts.length;
  alerts = alerts.filter(a => a.id !== id);
  return alerts.length < initialLength;
};

// Clear all alerts
export const clearAllAlerts = (): void => {
  alerts = [];
};

// Generate alert from URL check result
export const generateUrlCheckAlert = (
  url: string,
  threatLevel: "safe" | "low" | "medium" | "high",
  score: number,
  metadata?: Record<string, any>
): Alert | null => {
  // Only create alerts for medium or high threat levels
  if (threatLevel === "safe" || threatLevel === "low") {
    return null;
  }
  
  let severity: Alert["severity"] = "medium";
  let title = "Suspicious URL Detected";
  
  if (threatLevel === "high") {
    severity = "high";
    title = "High Risk URL Detected";
  }
  
  const message = `A ${threatLevel} risk URL was detected: ${url} (Safety score: ${Math.round(score * 100)}%)`;
  
  return createAlert(
    title,
    message,
    severity,
    "url_check",
    url,
    metadata
  );
};

// Simulate notification delivery
export const sendNotification = async (alert: Alert, recipients: string[]): Promise<boolean> => {
  // In a real implementation, this would send emails, push notifications, etc.
  console.log(`MOCK: Sending notification for alert ${alert.id} to ${recipients.join(', ')}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate success with occasional failures
  return Math.random() > 0.1;
};
