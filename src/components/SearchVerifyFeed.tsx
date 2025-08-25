import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Share2, 
  Heart, 
  MessageCircle,
  Bookmark,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  content: string;
  author: string;
  source: string;
  timestamp: string;
  verified: 'true' | 'false' | 'partial' | 'checking';
  confidence: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  tags: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    content: 'Breaking: New emergency shelter locations have been confirmed by local authorities. Three additional sites are now operational.',
    author: 'Emergency Management',
    source: 'Official Alert',
    timestamp: '2 min ago',
    verified: 'true',
    confidence: 98,
    engagement: { likes: 247, shares: 89, comments: 15 },
    tags: ['Emergency', 'Shelter', 'Official'],
    urgency: 'high'
  },
  {
    id: '2',
    content: 'FAKE: Claim that drinking bleach can prevent infection. This is dangerous misinformation - DO NOT follow this advice.',
    author: 'FactCheck Team',
    source: 'Health Authority',
    timestamp: '5 min ago',
    verified: 'false',
    confidence: 95,
    engagement: { likes: 156, shares: 45, comments: 8 },
    tags: ['Health', 'Debunked', 'Dangerous'],
    urgency: 'critical'
  },
  {
    id: '3',
    content: 'Reports suggest supply chain disruptions may affect local grocery stores. Some information appears accurate but lacks official confirmation.',
    author: 'Community Reporter',
    source: 'Local News',
    timestamp: '12 min ago',
    verified: 'partial',
    confidence: 67,
    engagement: { likes: 89, shares: 23, comments: 31 },
    tags: ['Supply Chain', 'Unconfirmed', 'Local'],
    urgency: 'medium'
  }
];

export const SearchVerifyFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [newsItems] = useState<NewsItem[]>(mockNewsItems);
  const { toast } = useToast();

  const handleVerifySearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Verification Complete",
        description: "Your search has been fact-checked against trusted sources",
      });
    }, 2000);
  };

  const getVerificationBadge = (verified: NewsItem['verified'], confidence: number) => {
    switch (verified) {
      case 'true':
        return <Badge className="bg-verified text-verified-foreground">✓ Verified {confidence}%</Badge>;
      case 'false':
        return <Badge variant="destructive">✗ False {confidence}%</Badge>;
      case 'partial':
        return <Badge variant="secondary">⚠ Partial {confidence}%</Badge>;
      default:
        return <Badge variant="outline">🔍 Checking...</Badge>;
    }
  };

  const getUrgencyColor = (urgency: NewsItem['urgency']) => {
    switch (urgency) {
      case 'critical': return 'border-l-destructive';
      case 'high': return 'border-l-warning';
      case 'medium': return 'border-l-primary';
      default: return 'border-l-muted';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Search & Verify Section */}
      <Card className="sticky top-4 z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Verify News & Claims</h2>
          </div>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search or paste news to verify..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleVerifySearch()}
              />
            </div>
            <Button 
              onClick={handleVerifySearch}
              disabled={!searchQuery.trim() || isVerifying}
              size="sm"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Trending Verifications</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Emergency Shelters', 'Supply Chain', 'Health Guidelines', 'Transport Updates'].map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-hover-bg">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <h3 className="text-lg font-semibold">Live Verification Feed</h3>
          <Badge variant="outline" className="animate-pulse">Live</Badge>
        </div>
        
        {newsItems.map((item) => (
          <Card key={item.id} className={`border-l-4 ${getUrgencyColor(item.urgency)} hover:shadow-md transition-shadow`}>
            <CardContent className="pt-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {item.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{item.author}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{item.source}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
                {getVerificationBadge(item.verified, item.confidence)}
              </div>

              {/* Content */}
              <p className="text-sm mb-3 leading-relaxed">{item.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{item.engagement.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{item.engagement.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">{item.engagement.shares}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-hover-bg rounded">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 hover:bg-hover-bg rounded">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline" className="w-full">
          Load More Verifications
        </Button>
      </div>
    </div>
  );
};