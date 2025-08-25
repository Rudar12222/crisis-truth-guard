import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MisinformationDashboard } from '@/components/MisinformationDashboard';
import { FactCheckPanel } from '@/components/FactCheckPanel';
import { AlertGenerator } from '@/components/AlertGenerator';
import { Shield, Search, Megaphone, BarChart3 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* System Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary rounded-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                CrisisGuard AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Agentic AI System for Real-Time Misinformation Combat
              </p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground">
              Continuously scanning trusted sources, detecting false claims, and generating fact-based corrections 
              to help the public stay informed during crises.
            </p>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 h-auto p-1 bg-card">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Live Monitor</span>
            </TabsTrigger>
            <TabsTrigger 
              value="verify" 
              className="flex items-center space-x-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Search className="h-4 w-4" />
              <span>Fact Check</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex items-center space-x-2 h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Megaphone className="h-4 w-4" />
              <span>Generate Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MisinformationDashboard />
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <FactCheckPanel />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertGenerator />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>CrisisGuard AI - Protecting public information integrity during emergencies</p>
          <p className="mt-1">Always verify critical information through official sources</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
