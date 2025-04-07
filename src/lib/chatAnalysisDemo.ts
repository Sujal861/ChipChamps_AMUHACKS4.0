
import { ConversationAnalysisRequest } from "@/types";
import { analyzeChatHistory } from "./behavioralAnalysisEngine";
import { MessageData } from "./behavioralAnalysisEngine";

// Sample predatory conversation patterns for demo purposes
const predatoryConversationPatterns: { name: string; messages: MessageData[] }[] = [
  {
    name: "Grooming Pattern - Basic",
    messages: [
      {
        content: "Hey there! You seem cool. How old are you?",
        timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
        senderId: "user1",
        recipientId: "minor1"
      },
      {
        content: "I'm 13. Who are you?",
        timestamp: new Date(Date.now() - 86400000 * 3 + 300000), // 5 minutes later
        senderId: "minor1",
        recipientId: "user1"
      },
      {
        content: "I'm 15! Do you have Instagram? We should chat there instead, this app is boring",
        timestamp: new Date(Date.now() - 86400000 * 3 + 600000), // 5 minutes later
        senderId: "user1",
        recipientId: "minor1"
      },
      {
        content: "What's your Instagram?",
        timestamp: new Date(Date.now() - 86400000 * 3 + 900000), // 5 minutes later
        senderId: "minor1",
        recipientId: "user1"
      },
      {
        content: "It's @cool_dude123. Add me and we can talk more privately there. Don't tell anyone though, I want to be friends just with you.",
        timestamp: new Date(Date.now() - 86400000 * 3 + 1200000), // 5 minutes later
        senderId: "user1",
        recipientId: "minor1"
      }
    ]
  },
  {
    name: "Grooming Pattern - Advanced",
    messages: [
      {
        content: "Hey, saw your comment on that gaming video. You seem to really know your stuff!",
        timestamp: new Date(Date.now() - 86400000 * 10), // 10 days ago
        senderId: "predator1",
        recipientId: "minor2"
      },
      {
        content: "Thanks! I play a lot of Minecraft and Fortnite.",
        timestamp: new Date(Date.now() - 86400000 * 10 + 3600000), // 1 hour later
        senderId: "minor2",
        recipientId: "predator1"
      },
      {
        content: "That's awesome. I'm actually working on a new gaming channel. How old are you? Maybe you could help me test some games?",
        timestamp: new Date(Date.now() - 86400000 * 9), // 9 days ago
        senderId: "predator1",
        recipientId: "minor2"
      },
      {
        content: "I'm 12. What games are you working on?",
        timestamp: new Date(Date.now() - 86400000 * 9 + 7200000), // 2 hours later
        senderId: "minor2",
        recipientId: "predator1"
      },
      {
        content: "Perfect! I have a beta version of a new game. I could send you a gift card to buy it, but don't tell your parents, they might get jealous lol. What's your address?",
        timestamp: new Date(Date.now() - 86400000 * 8), // 8 days ago
        senderId: "predator1",
        recipientId: "minor2"
      },
      {
        content: "I'm not supposed to give my address to people online...",
        timestamp: new Date(Date.now() - 86400000 * 8 + 3600000), // 1 hour later
        senderId: "minor2",
        recipientId: "predator1"
      },
      {
        content: "That's just what parents say because they don't understand gaming. I thought you were mature for your age. This is a special opportunity. I only chose you because you seem special.",
        timestamp: new Date(Date.now() - 86400000 * 8 + 4000000), // A bit later
        senderId: "predator1",
        recipientId: "minor2"
      },
      {
        content: "Do you have Discord? We can talk there instead. This will be our secret project.",
        timestamp: new Date(Date.now() - 86400000 * 8 + 4100000), // A bit later
        senderId: "predator1",
        recipientId: "minor2"
      }
    ]
  },
  {
    name: "Safe Conversation",
    messages: [
      {
        content: "Hi! Anyone here play Minecraft?",
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        senderId: "user3",
        recipientId: "group1"
      },
      {
        content: "I do! What's your favorite thing to build?",
        timestamp: new Date(Date.now() - 86400000 * 2 + 900000), // 15 minutes later
        senderId: "user4",
        recipientId: "group1"
      },
      {
        content: "I love building castle defense systems with redstone traps!",
        timestamp: new Date(Date.now() - 86400000 * 2 + 1800000), // 15 minutes later
        senderId: "user3",
        recipientId: "group1"
      },
      {
        content: "That's cool! I'm more into exploring the nether and finding rare biomes.",
        timestamp: new Date(Date.now() - 86400000 * 2 + 2700000), // 15 minutes later
        senderId: "user4",
        recipientId: "group1"
      },
      {
        content: "Have you found the new ancient city structures yet? They're so cool!",
        timestamp: new Date(Date.now() - 86400000 * 2 + 3600000), // 15 minutes later
        senderId: "user3",
        recipientId: "group1"
      }
    ]
  }
];

// Get a specific conversation by name
export const getDemoConversation = (name: string): MessageData[] => {
  const conversation = predatoryConversationPatterns.find(c => c.name === name);
  return conversation ? conversation.messages : [];
};

// Get all sample conversations
export const getAllDemoConversations = (): { name: string; messages: MessageData[] }[] => {
  return predatoryConversationPatterns;
};

// Analyze a sample conversation
export const analyzeSampleConversation = async (name: string) => {
  const conversation = getDemoConversation(name);
  if (!conversation.length) {
    throw new Error(`Conversation "${name}" not found`);
  }
  
  return await analyzeChatHistory(conversation);
};
