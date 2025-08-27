import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Star,
  Eye,
  MessageSquare,
  UserPlus,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TrendingTopic {
  name: string;
  color: string;
  claimCount: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface TopUser {
  id: string;
  display_name: string;
  avatar_url?: string;
  username: string;
  verifications: number;
  accuracy: number;
}

export const EnhancedSidebar = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [stats, setStats] = useState({
    totalClaims: 0,
    verified: 0,
    false: 0,
    investigating: 0,
    activeUsers: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTrendingTopics();
    fetchTopUsers();
    fetchStats();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select(`
          name,
          color,
          claim_topics(count)
        `);

      if (error) throw error;

      const topicsWithCounts = (data || []).map((topic: any) => ({
        name: topic.name,
        color: topic.color,
        claimCount: topic.claim_topics?.length || 0,
        trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down',
        change: Math.floor(Math.random() * 50) + 10
      }))
      .sort((a, b) => b.claimCount - a.claimCount)
      .slice(0, 5);

      setTrendingTopics(topicsWithCounts);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          avatar_url,
          username,
          claims(count)
        `)
        .limit(5);

      if (error) throw error;

      const usersWithStats = (data || []).map((profile: any) => ({
        id: profile.id,
        display_name: profile.display_name || 'Anonymous',
        avatar_url: profile.avatar_url,
        username: profile.username || 'user',
        verifications: profile.claims?.length || 0,
        accuracy: Math.floor(Math.random() * 30) + 70 // Mock accuracy
      }))
      .sort((a, b) => b.verifications - a.verifications);

      setTopUsers(usersWithStats);
    } catch (error) {
      console.error('Error fetching top users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: claimsData } = await supabase
        .from('claims')
        .select('verification_status');

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id');

      const claims = claimsData || [];
      const verified = claims.filter(c => c.verification_status === 'verified').length;
      const falseClaims = claims.filter(c => c.verification_status === 'false').length;
      const investigating = claims.filter(c => c.verification_status === 'investigating').length;

      setStats({
        totalClaims: claims.length,
        verified,
        false: falseClaims,
        investigating,
        activeUsers: profilesData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-verified';
    if (accuracy >= 75) return 'text-primary';
    if (accuracy >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-4">
      {/* Live Stats */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Zap className="h-5 w-5 text-primary" />
            <span>Live Stats</span>
            <Badge variant="outline" className="animate-pulse ml-auto bg-primary/10">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-verified/10 rounded-lg border border-verified/20">
              <div className="text-lg font-bold text-verified">{stats.verified}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-lg font-bold text-destructive">{stats.false}</div>
              <div className="text-xs text-muted-foreground">False</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="text-lg font-bold text-warning">{stats.investigating}</div>
              <div className="text-xs text-muted-foreground">Checking</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-lg font-bold text-primary">{stats.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
          </div>
          <div className="text-center p-2 bg-card rounded border">
            <div className="text-sm font-medium">{stats.totalClaims} Total Claims</div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Trending Now</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-hover-bg rounded-lg cursor-pointer transition-colors border">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: topic.color }}
                  />
                  <span className="font-medium text-sm">{topic.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {topic.claimCount} claims
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${
                  topic.trend === 'up' ? 'text-verified' : 'text-destructive'
                }`}>
                  {topic.trend === 'up' ? '+' : '-'}{topic.change}%
                </span>
                <TrendingUp 
                  className={`h-4 w-4 ${
                    topic.trend === 'up' 
                      ? 'text-verified' 
                      : 'text-destructive rotate-180'
                  }`} 
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            <span>Top Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topUsers.map((contributor, index) => (
            <div key={contributor.id} className="flex items-center space-x-3 p-2 hover:bg-hover-bg rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-2 flex-1">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contributor.avatar_url} />
                    <AvatarFallback className="text-xs bg-primary/10">
                      {contributor.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {index < 3 && (
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      'bg-amber-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {contributor.display_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    @{contributor.username}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{contributor.verifications}</div>
                <div className={`text-xs ${getAccuracyColor(contributor.accuracy)}`}>
                  {contributor.accuracy}% acc
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start hover:bg-destructive/10 hover:text-destructive hover:border-destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Misinformation
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary">
            <Users className="h-4 w-4 mr-2" />
            Join Community
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start hover:bg-verified/10 hover:text-verified hover:border-verified">
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Verification
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start hover:bg-warning/10 hover:text-warning hover:border-warning">
            <Eye className="h-4 w-4 mr-2" />
            Fact-Check Guide
          </Button>
        </CardContent>
      </Card>

      {/* User Engagement */}
      {user && (
        <Card className="bg-gradient-to-br from-verified/5 to-verified/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Star className="h-5 w-5 text-verified" />
              <span>Your Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verification Level</span>
                <span className="font-medium">Novice</span>
              </div>
              <Progress value={35} className="h-2" />
              <div className="text-xs text-muted-foreground">
                15 more verifications to reach Expert
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-card rounded border">
                <div className="text-lg font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Claims</div>
              </div>
              <div className="p-2 bg-card rounded border">
                <div className="text-lg font-bold text-verified">87%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};