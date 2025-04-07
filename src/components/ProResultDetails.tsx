
import React from 'react';
import { URLCheckResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, AlertTriangle, Shield, Link2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProResultDetailsProps {
  result: URLCheckResult;
}

const ProResultDetails: React.FC<ProResultDetailsProps> = ({ result }) => {
  if (!result.proData) return null;
  
  const {
    redirectChainDetected,
    obfuscationMethods,
    maliciousPayload,
    domainFirstReported,
    reportCount
  } = result.proData;
  
  // Format date if available
  const formatDate = (date?: Date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString();
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-4"
    >
      <Card className="bg-gradient-to-br from-slate-900/80 to-indigo-900/40 border border-indigo-500/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span>CyberShield Pro Analysis</span>
            <Badge className="ml-auto bg-indigo-600">Enterprise</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="threats">
            <TabsList className="grid grid-cols-2 bg-black/20">
              <TabsTrigger value="threats">Threat Detection</TabsTrigger>
              <TabsTrigger value="details">Technical Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="threats" className="pt-4">
              <motion.div className="space-y-4" variants={containerVariants}>
                {/* Threat Indicators */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${maliciousPayload ? 'bg-red-500/20 border border-red-500/30' : 'bg-green-500/20 border border-green-500/30'}`}>
                    <AlertTriangle className={`h-5 w-5 ${maliciousPayload ? 'text-red-400' : 'text-green-400'}`} />
                    <div>
                      <p className="text-sm font-medium">Malicious Payload</p>
                      <p className="text-xs text-white/70">{maliciousPayload ? 'Detected' : 'Not Detected'}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${redirectChainDetected ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-green-500/20 border border-green-500/30'}`}>
                    <Link2 className={`h-5 w-5 ${redirectChainDetected ? 'text-amber-400' : 'text-green-400'}`} />
                    <div>
                      <p className="text-sm font-medium">Redirect Chain</p>
                      <p className="text-xs text-white/70">{redirectChainDetected ? 'Detected' : 'Not Detected'}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Obfuscation Methods */}
                {obfuscationMethods && obfuscationMethods.length > 0 && (
                  <motion.div variants={itemVariants} className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-amber-400" />
                      Obfuscation Techniques Detected
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {obfuscationMethods.map((method, index) => (
                        <Badge key={index} className="bg-amber-500/30 text-amber-200">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* First Reported Info */}
                {(domainFirstReported || reportCount) && (
                  <motion.div variants={itemVariants} className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium mb-2">Threat Intelligence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {domainFirstReported && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-white/60" />
                          <div>
                            <p className="text-xs text-white/70">First Reported</p>
                            <p className="text-sm">{formatDate(domainFirstReported)}</p>
                          </div>
                        </div>
                      )}
                      
                      {reportCount && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-white/60" />
                          <div>
                            <p className="text-xs text-white/70">Report Count</p>
                            <p className="text-sm">{reportCount}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {/* Recommendation */}
                <motion.div variants={itemVariants} className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30">
                  <h3 className="text-sm font-medium mb-1">Security Recommendation</h3>
                  <p className="text-sm text-white/80">
                    {result.threatLevel === "high" ? (
                      "This URL shows multiple high-risk indicators. Strongly advise against proceeding."
                    ) : result.threatLevel === "medium" ? (
                      "This URL contains suspicious elements. Proceed with caution and verify the source."
                    ) : (
                      "This URL appears relatively safe, but always verify the source before sharing sensitive information."
                    )}
                  </p>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <motion.div className="space-y-4" variants={containerVariants}>
                {/* Scan Details */}
                <motion.div variants={itemVariants} className="bg-black/20 p-3 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium mb-2">Scan Performance</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-white/60" />
                      <div>
                        <p className="text-xs text-white/70">Scan Time</p>
                        <p className="text-sm">{result.scanSpeed || "Unknown"} ms</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-white/60" />
                      <div>
                        <p className="text-xs text-white/70">Confidence</p>
                        <p className="text-sm">{Math.round((result.confidenceScore || 0) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Domain Analysis */}
                {result.features && (
                  <motion.div variants={itemVariants} className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium mb-2">Domain Analysis</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-xs text-white/70">Domain Age</p>
                        <p className="text-sm">{result.features.domainAge ? `${result.features.domainAge} days` : "Unknown"}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/70">Special Characters</p>
                        <p className="text-sm">{result.features.specialCharCount || 0}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/70">URL Length</p>
                        <p className="text-sm">{result.features.length} characters</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-white/70">Subdomain Structure</p>
                        <p className="text-sm">{result.features.hasExcessiveSubdomains ? "Complex" : "Normal"}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Security Headers */}
                {result.features?.securityHeaders && (
                  <motion.div variants={itemVariants} className="bg-black/20 p-3 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium mb-2">Security Headers</h3>
                    <div className="grid grid-cols-1 gap-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">HTTP Strict Transport Security</p>
                        <Badge className={result.features.securityHeaders.hasHSTS ? "bg-green-500/80" : "bg-red-500/80"}>
                          {result.features.securityHeaders.hasHSTS ? "Present" : "Missing"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm">X-Frame-Options</p>
                        <Badge className={result.features.securityHeaders.hasXFrameOptions ? "bg-green-500/80" : "bg-red-500/80"}>
                          {result.features.securityHeaders.hasXFrameOptions ? "Present" : "Missing"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Content-Security-Policy</p>
                        <Badge className={result.features.securityHeaders.hasContentSecurityPolicy ? "bg-green-500/80" : "bg-red-500/80"}>
                          {result.features.securityHeaders.hasContentSecurityPolicy ? "Present" : "Missing"}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProResultDetails;
