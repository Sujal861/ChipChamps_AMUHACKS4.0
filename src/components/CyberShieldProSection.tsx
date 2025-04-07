
import React, { useState } from "react";
import { Shield, AlertTriangle, User, LineChart, Link2, Brain, Server, Database, Lock, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CyberShieldProSection = () => {
  const features = [
    { 
      icon: <Link2 className="h-5 w-5 text-indigo-400" />, 
      title: "Disguised Link Detection", 
      description: "Identifies malicious links and phishing attempts in real-time" 
    },
    { 
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />, 
      title: "Social Engineering Detection", 
      description: "Recognizes tactics used by cybercriminals to manipulate users" 
    },
    { 
      icon: <User className="h-5 w-5 text-red-400" />, 
      title: "Predatory Pattern Recognition", 
      description: "Detects subtle grooming patterns that evade standard moderation" 
    },
    { 
      icon: <LineChart className="h-5 w-5 text-green-400" />, 
      title: "Conversation Analysis", 
      description: "Identifies predatory conversation patterns targeting vulnerable users" 
    },
    { 
      icon: <Brain className="h-5 w-5 text-purple-400" />, 
      title: "Psychological Profiling", 
      description: "Detects manipulation and progressive boundary-testing" 
    }
  ];
  
  const architectureComponents = [
    {
      icon: <Link2 className="h-5 w-5 text-blue-400" />,
      title: "Link Analysis Engine",
      items: [
        "Real-time URL extraction and verification against multiple threat databases",
        "Deep link inspection using containerized sandboxing technology",
        "Dynamic content assessment for concealed malicious payloads",
        "Domain reputation scoring using proprietary algorithm"
      ]
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-400" />,
      title: "Behavioral Pattern Recognition",
      items: [
        "NLP-powered conversation flow analysis detecting grooming patterns",
        "Multi-stage message sequencing identification (trust-building → isolation → exploitation)",
        "Sentiment analysis detecting manipulation tactics and emotional pressure",
        "Cross-conversation correlation to identify coordinated predatory activities",
        "Age-appropriate communication modeling with deviation alerts"
      ]
    },
    {
      icon: <Server className="h-5 w-5 text-green-400" />,
      title: "Technical Implementation",
      items: [
        "Microservices architecture with containerized components for scalability",
        "Redis-backed real-time processing queue with sub-200ms latency",
        "TensorFlow-based ML models with weekly retraining cycles",
        "API endpoints for seamless integration with existing platforms",
        "Anonymized data processing compliant with GDPR and COPPA",
        "Role-based access control for administrative functions"
      ]
    },
    {
      icon: <Bell className="h-5 w-5 text-amber-400" />,
      title: "Alerting System",
      items: [
        "Tiered threat classification (Low/Medium/High/Critical)",
        "Customizable notification workflows based on threat severity",
        "Forensic data capture for law enforcement coordination",
        "Detailed audit logging for compliance and investigation"
      ]
    }
  ];
  
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/80 border border-white/10 backdrop-blur-lg shadow-xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="p-2 bg-indigo-500/20 rounded-lg"
            variants={itemVariants}
          >
            <Shield className="h-8 w-8 text-indigo-400" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              CyberShield Pro
            </h2>
            <p className="text-white/70">Advanced Threat & Predator Detection Platform</p>
          </motion.div>
        </div>
        
        <motion.p 
          className="mb-8 text-white/80 max-w-3xl"
          variants={itemVariants}
        >
          Our enterprise-grade security solution combines malicious link scanning with AI-powered 
          behavioral analysis for comprehensive protection.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mb-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 backdrop-blur-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="architecture">Technical Architecture</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
                variants={containerVariants}
              >
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                    variants={itemVariants}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-black/30 rounded-md mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                        <p className="text-sm text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                className="bg-black/20 rounded-lg border border-white/5 p-5 mb-8"
                variants={itemVariants}
              >
                <p className="text-white/80 mb-4">
                  Built with cutting-edge machine learning algorithms and trained on millions of real-world cases, 
                  CyberShield Pro delivers real-time protection with minimal system impact. Our dashboard provides 
                  comprehensive threat analytics, customizable alert thresholds, and integration with major social platforms.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">Fortune 500 Companies</Badge>
                  <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Educational Institutions</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">Government Agencies</Badge>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="architecture" className="mt-0">
              <motion.div variants={containerVariants} className="space-y-6">
                {architectureComponents.map((component, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants} 
                    className="bg-white/5 backdrop-blur-md p-5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-black/30 rounded-md">
                        {component.icon}
                      </div>
                      <h3 className="text-lg font-medium text-white">{component.title}</h3>
                    </div>
                    <ul className="space-y-2 text-white/80">
                      {component.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="min-w-5 pt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1"></div>
                          </div>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                
                <motion.div 
                  variants={itemVariants} 
                  className="bg-gradient-to-r from-slate-900/80 to-indigo-900/50 p-5 rounded-lg border border-indigo-500/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-black/30 rounded-md">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Enterprise-Grade Security</h3>
                  </div>
                  <p className="text-white/80 mb-4 text-sm">
                    Our architecture is designed with security and performance in mind, providing enterprise-level protection
                    without compromising system resources or user experience.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-2xl font-semibold text-indigo-400">99.9%</p>
                      <p className="text-xs text-white/60">Threat Detection Rate</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-2xl font-semibold text-green-400">&lt;200ms</p>
                      <p className="text-xs text-white/60">Processing Latency</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-2xl font-semibold text-amber-400">24/7</p>
                      <p className="text-xs text-white/60">Monitoring</p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                      <p className="text-2xl font-semibold text-purple-400">100%</p>
                      <p className="text-xs text-white/60">GDPR Compliance</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-lg border border-indigo-500/20"
          variants={itemVariants}
        >
          <div className="mb-4 sm:mb-0">
            <p className="text-xl font-semibold text-white">Starting at $499/month</p>
            <p className="text-white/70">for enterprise deployment</p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white">
            Request Enterprise Demo
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CyberShieldProSection;
