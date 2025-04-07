
// Simulate NLP-powered behavioral analysis for predatory patterns

// Types for behavioral analysis
export interface MessageData {
  content: string;
  timestamp: Date;
  senderId: string;
  recipientId: string;
}

export interface BehavioralAnalysisResult {
  threatLevel: "safe" | "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  detectedPatterns: {
    type: string;
    description: string;
    confidence: number;
    examples?: string[];
    severity: "info" | "warning" | "danger" | "critical";
  }[];
  timeframeAnalysis: {
    startTime: Date;
    endTime: Date;
    messageCount: number;
    escalationSpeed: "slow" | "moderate" | "rapid";
  };
  recommendedActions: string[];
}

// Database of pattern signatures (simplified for mock)
const behavioralPatterns = [
  {
    type: "isolation_attempt",
    keywords: ["secret", "just between us", "don't tell", "private", "our secret"],
    severity: "danger",
    description: "Attempts to create secretive, isolated communication"
  },
  {
    type: "trust_building",
    keywords: ["trust me", "you can trust", "believe me", "I promise", "I'm your friend"],
    severity: "warning",
    description: "Excessive trust building language"
  },
  {
    type: "personal_information",
    keywords: ["where do you live", "how old", "home alone", "parents", "address", "school"],
    severity: "danger",
    description: "Soliciting personal or location information"
  },
  {
    type: "gift_offering",
    keywords: ["send you", "give you", "gift", "present", "prize", "reward", "money"],
    severity: "danger",
    description: "Offering gifts or incentives"
  },
  {
    type: "moving_platforms",
    keywords: ["instagram", "snapchat", "whatsapp", "discord", "dm me", "message me on"],
    severity: "warning",
    description: "Attempting to move conversation to different platform"
  },
  {
    type: "emotional_manipulation",
    keywords: ["nobody understands", "only one who gets", "special connection", "mature for your age"],
    severity: "critical",
    description: "Emotional manipulation to establish connection"
  },
  {
    type: "boundary_testing",
    keywords: ["photo", "picture", "camera", "sent me", "show me", "video"],
    severity: "danger",
    description: "Requesting images or testing boundaries"
  }
];

// Identify patterns in message content
const detectPatterns = (messages: MessageData[]): BehavioralAnalysisResult["detectedPatterns"] => {
  const detectedPatterns: BehavioralAnalysisResult["detectedPatterns"] = [];
  
  // Concatenate all message content for analysis
  const allContent = messages.map(m => m.content.toLowerCase()).join(" ");
  
  // Check for each pattern
  behavioralPatterns.forEach(pattern => {
    const matchedKeywords = pattern.keywords.filter(keyword => 
      allContent.includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length > 0) {
      // Calculate confidence based on number of matches
      const confidence = Math.min(0.5 + (matchedKeywords.length / pattern.keywords.length) * 0.5, 0.97);
      
      detectedPatterns.push({
        type: pattern.type,
        description: pattern.description,
        confidence,
        severity: pattern.severity as "info" | "warning" | "danger" | "critical",
        examples: matchedKeywords
      });
    }
  });
  
  return detectedPatterns;
};

// Analyze message frequency and time patterns
const analyzeTimeframe = (messages: MessageData[]): BehavioralAnalysisResult["timeframeAnalysis"] => {
  if (messages.length < 2) {
    return {
      startTime: new Date(),
      endTime: new Date(),
      messageCount: messages.length,
      escalationSpeed: "slow"
    };
  }
  
  // Sort messages by timestamp
  const sortedMessages = [...messages].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const startTime = sortedMessages[0].timestamp;
  const endTime = sortedMessages[sortedMessages.length - 1].timestamp;
  
  // Calculate duration in hours
  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  
  // Calculate message frequency (messages per hour)
  const frequency = messages.length / Math.max(durationHours, 1);
  
  // Determine escalation speed
  let escalationSpeed: "slow" | "moderate" | "rapid";
  if (frequency < 5) {
    escalationSpeed = "slow";
  } else if (frequency < 15) {
    escalationSpeed = "moderate";
  } else {
    escalationSpeed = "rapid";
  }
  
  return {
    startTime,
    endTime,
    messageCount: messages.length,
    escalationSpeed
  };
};

// Generate recommended actions based on analysis
const generateRecommendations = (
  patterns: BehavioralAnalysisResult["detectedPatterns"],
  timeframe: BehavioralAnalysisResult["timeframeAnalysis"]
): string[] => {
  const recommendations: string[] = [];
  
  // Check for critical patterns
  if (patterns.some(p => p.severity === "critical")) {
    recommendations.push("Immediately restrict communication between these users");
    recommendations.push("Review full conversation history for evidence collection");
    recommendations.push("Escalate to security team for immediate intervention");
  }
  
  // Check for danger patterns
  if (patterns.some(p => p.severity === "danger")) {
    recommendations.push("Temporarily suspend communication between these users");
    recommendations.push("Issue warning to potential victim about sharing personal information");
    recommendations.push("Schedule review with moderation team");
  }
  
  // Check for rapid escalation
  if (timeframe.escalationSpeed === "rapid" && timeframe.messageCount > 20) {
    recommendations.push("Monitor this conversation with increased scrutiny");
    recommendations.push("Apply stricter filtering to future messages in this conversation");
  }
  
  // If no severe recommendations yet, but still has warnings
  if (recommendations.length === 0 && patterns.some(p => p.severity === "warning")) {
    recommendations.push("Apply enhanced monitoring to this conversation");
    recommendations.push("Review after 24 hours for pattern development");
  }
  
  // Default recommendation if nothing else applies
  if (recommendations.length === 0) {
    recommendations.push("Continue standard monitoring procedures");
  }
  
  return recommendations;
};

// Main function to analyze conversation
export const analyzeConversation = (messages: MessageData[]): BehavioralAnalysisResult => {
  // Detect patterns in messages
  const detectedPatterns = detectPatterns(messages);
  
  // Analyze message timing and frequency
  const timeframeAnalysis = analyzeTimeframe(messages);
  
  // Generate recommendations based on findings
  const recommendedActions = generateRecommendations(detectedPatterns, timeframeAnalysis);
  
  // Calculate overall threat level
  let threatLevel: BehavioralAnalysisResult["threatLevel"] = "safe";
  let maxSeverityScore = 0;
  
  // Convert severity to numeric score for comparison
  const severityScores = {
    "info": 1,
    "warning": 2,
    "danger": 3,
    "critical": 4
  };
  
  // Find highest severity pattern
  detectedPatterns.forEach(pattern => {
    const severityScore = severityScores[pattern.severity];
    if (severityScore > maxSeverityScore) {
      maxSeverityScore = severityScore;
    }
  });
  
  // Adjust for rapid escalation
  if (timeframeAnalysis.escalationSpeed === "rapid") {
    maxSeverityScore += 1;
  }
  
  // Map severity score to threat level
  if (maxSeverityScore >= 4) {
    threatLevel = "critical";
  } else if (maxSeverityScore === 3) {
    threatLevel = "high";
  } else if (maxSeverityScore === 2) {
    threatLevel = "medium";
  } else if (maxSeverityScore === 1) {
    threatLevel = "low";
  }
  
  // Calculate confidence based on pattern consistency and message count
  const confidenceScore = Math.min(
    0.7 + (Math.min(messages.length, 50) / 100) + (detectedPatterns.length / 10),
    0.98
  );
  
  return {
    threatLevel,
    confidenceScore,
    detectedPatterns,
    timeframeAnalysis,
    recommendedActions
  };
};

// Sample API call function for conversation analysis
export const analyzeChatHistory = async (
  chatHistory: MessageData[]
): Promise<BehavioralAnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  return analyzeConversation(chatHistory);
};
