import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Globe,
  Zap
} from 'lucide-react';

export const SocialSidebar = () => {
  const trendingTopics = [
    { topic: 'Emergency Shelters', posts: 1234, trend: 'up' },
    { topic: 'Supply Chain Updates', posts: 856, trend: 'up' },
    { topic: 'Health Guidelines', posts: 643, trend: 'down' },
    { topic: 'Transport Alerts', posts: 421, trend: 'up' },
    { topic: 'Weather Warnings', posts: 389, trend: 'stable' }
  ];

  const verificationStats = {
    totalChecked: 15842,
    verified: 12673,
    debunked: 2156,
    pending: 1013
  };

  const activeSources = [
    { name: 'Emergency Management', status: 'active', reliability: 98 },
    { name: 'Health Authority', status: 'active', reliability: 96 },
    { name: 'Local Government', status: 'active', reliability: 94 },
    { name: 'Weather Service', status: 'delayed', reliability: 92 },
    { name: 'Transport Authority', status: 'active', reliability: 89 }
  ];

  return (
    <div className="space-y-4">
      {/* Real-time Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Zap className="h-5 w-5 text-primary" />
            <span>Live Stats</span>
            <Badge variant="outline" className="animate-pulse ml-auto">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-verified/10 rounded">
              <div className="text-lg font-bold text-verified">{verificationStats.verified.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div className="text-center p-2 bg-destructive/10 rounded">
              <div className="text-lg font-bold text-destructive">{verificationStats.debunked.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Debunked</div>
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm font-medium">{verificationStats.pending.toLocaleString()} Checking</div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            <span>Trending Now</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingTopics.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-hover-bg rounded cursor-pointer">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.topic}</div>
                <div className="text-xs text-muted-foreground">{item.posts.toLocaleString()} posts</div>
              </div>
              <div className="flex items-center space-x-1">
                {item.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-verified" />
                ) : item.trend === 'down' ? (
                  <TrendingUp className="h-3 w-3 text-destructive rotate-180" />
                ) : (
                  <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Active Sources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Globe className="h-5 w-5" />
            <span>Trusted Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeSources.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  source.status === 'active' ? 'bg-verified' : 'bg-warning'
                }`} />
                <div>
                  <div className="font-medium text-sm">{source.name}</div>
                  <div className="text-xs text-muted-foreground">{source.reliability}% reliable</div>
                </div>
              </div>
              {source.status === 'active' ? (
                <CheckCircle className="h-4 w-4 text-verified" />
              ) : (
                <Clock className="h-4 w-4 text-warning" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Shield className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Misinformation
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Submit Community Tip
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};