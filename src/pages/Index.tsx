import { SearchVerifyFeed } from '@/components/SearchVerifyFeed';
import { SocialSidebar } from '@/components/SocialSidebar';
import { MisinformationDashboard } from '@/components/MisinformationDashboard';
import { AlertGenerator } from '@/components/AlertGenerator';
import { Shield, Search, BarChart3, Megaphone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const Index = () => {
  const [activeView, setActiveView] = useState('feed');

  return (
    <div className="min-h-screen bg-social-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">FactStream</h1>
                <p className="text-xs text-muted-foreground">Real-time news verification</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1">
              <Button
                variant={activeView === 'feed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('feed')}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Feed</span>
              </Button>
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('dashboard')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Monitor</span>
              </Button>
              <Button
                variant={activeView === 'alerts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('alerts')}
                className="flex items-center space-x-2"
              >
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="animate-pulse">
                Live
              </Badge>
              <Button size="sm" className="hidden sm:flex">
                Report Misinformation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {activeView === 'feed' && <SearchVerifyFeed />}
            {activeView === 'dashboard' && <MisinformationDashboard />}
            {activeView === 'alerts' && <AlertGenerator />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SocialSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
