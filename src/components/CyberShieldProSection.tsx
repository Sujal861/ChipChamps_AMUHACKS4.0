
import React from "react";
import { Shield, AlertTriangle, User, LineChart, Link2, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
