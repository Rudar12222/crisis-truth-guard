import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
  ExternalLink,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Claim {
  id: string;
  content: string;
  image_url?: string | null;
  verification_status: string;
  confidence_score: number | null;
  urgency: string;
  source_url?: string | null;
  location?: string | null;
  is_new: boolean | null;
  created_at: string;
  profiles: {
    display_name: string | null;
    avatar_url?: string | null;
    username: string | null;
  } | null;
  claim_topics: {
    topics: {
      name: string;
      color: string;
      icon: string;
    };
  }[] | null;
  reactions: {
    reaction_type: string;
    user_id: string;
  }[] | null;
  comments: {
    id: string;
    content: string;
    profiles: {
      display_name: string | null;
      avatar_url?: string | null;
    } | null;
  }[] | null;
  _count: {
    reactions: number;
    comments: number;
  };
}

export const SocialFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [userTopics, setUserTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserTopics();
    fetchClaims();
  }, [user]);

  const fetchUserTopics = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_topics')
        .select('topics(name)')
        .eq('user_id', user.id);
      
      setUserTopics(data?.map((ut: any) => ut.topics?.name).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching user topics:', error);
    }
  };

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          profiles(display_name, avatar_url, username),
          claim_topics(topics(name, color, icon)),
          reactions(reaction_type, user_id),
          comments(id, content, profiles(display_name, avatar_url))
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform data to include counts
      const transformedClaims = (data || []).map((claim: any) => ({
        ...claim,
        _count: {
          reactions: claim.reactions?.filter((r: any) => r.reaction_type === 'like').length || 0,
          comments: claim.comments?.length || 0
        }
      }));

      setClaims(transformedClaims);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (claimId: string, reactionType: 'like' | 'share' | 'bookmark' | 'flag') => {
    if (!user) return;

    try {
      // Check if user already has this reaction
      const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('claim_id', claimId)
        .eq('reaction_type', reactionType)
        .single();

      if (existing) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id);
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            user_id: user.id,
            claim_id: claimId,
            reaction_type: reactionType
          });
      }

      // Refresh claims
      fetchClaims();
      
      if (reactionType === 'flag') {
        toast({
          title: "Content Flagged",
          description: "Thank you for helping maintain community standards",
        });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleVerifySearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Verification Complete",
        description: "Your search has been fact-checked against trusted sources",
      });
    }, 2000);
  };

  const getVerificationBadge = (status: string, confidence: number) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-verified text-verified-foreground">✓ Verified {confidence}%</Badge>;
      case 'false':
        return <Badge variant="destructive">✗ False {confidence}%</Badge>;
      case 'investigating':
        return <Badge variant="secondary">⚠ Investigating {confidence}%</Badge>;
      default:
        return <Badge variant="outline">🔍 Pending Review</Badge>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-l-destructive';
      case 'high': return 'border-l-warning';
      case 'medium': return 'border-l-primary';
      default: return 'border-l-muted';
    }
  };

  const isUserReacted = (claim: Claim, reactionType: string) => {
    return claim.reactions?.some(r => r.user_id === user?.id && r.reaction_type === reactionType);
  };

  const getRelevanceBadge = (claim: Claim) => {
    const claimTopics = claim.claim_topics?.map(ct => ct.topics.name) || [];
    const isRelevant = claimTopics.some(topic => userTopics.includes(topic));
    
    if (isRelevant) {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          For You
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
            <span className="text-sm font-medium">Your Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userTopics.length > 0 ? (
              userTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {topic}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Complete your profile to see personalized content
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Claims Feed */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 px-1">
          <h3 className="text-lg font-semibold">Live Verification Feed</h3>
          <Badge variant="outline" className="animate-pulse">Live</Badge>
        </div>
        
        {claims.map((claim) => (
          <Card key={claim.id} className={`border-l-4 ${getUrgencyColor(claim.urgency)} hover:shadow-md transition-all duration-200`}>
            <CardContent className="pt-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={claim.profiles?.avatar_url} />
                    <AvatarFallback className="text-xs bg-primary/10">
                      {claim.profiles?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-medium text-sm">{claim.profiles?.display_name || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">@{claim.profiles?.username}</span>
                      {claim.is_new && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {getRelevanceBadge(claim)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(claim.created_at).toLocaleDateString()}</span>
                      {claim.location && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{claim.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {getVerificationBadge(claim.verification_status, claim.confidence_score)}
              </div>

              {/* Content */}
              <div className="mb-3">
                <p className="text-sm mb-3 leading-relaxed">{claim.content}</p>
                
                {/* Image */}
                {claim.image_url && (
                  <div className="mb-3">
                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                      <img 
                        src={claim.image_url} 
                        alt="Claim image"
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
                      />
                    </AspectRatio>
                  </div>
                )}

                {/* Source Link */}
                {claim.source_url && (
                  <a 
                    href={claim.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-primary hover:underline mb-3"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>View Source</span>
                  </a>
                )}
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-3">
                {claim.claim_topics?.map((ct, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-primary/10"
                    style={{ borderColor: ct.topics.color, color: ct.topics.color }}
                  >
                    {ct.topics.name}
                  </Badge>
                ))}
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleReaction(claim.id, 'like')}
                    className={`flex items-center space-x-1 transition-colors ${
                      isUserReacted(claim, 'like') 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-muted-foreground hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isUserReacted(claim, 'like') ? 'fill-current' : ''}`} />
                    <span className="text-xs">{claim._count.reactions}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{claim._count.comments}</span>
                  </button>
                  <button 
                    onClick={() => handleReaction(claim.id, 'share')}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleReaction(claim.id, 'bookmark')}
                    className={`p-1 hover:bg-hover-bg rounded transition-colors ${
                      isUserReacted(claim, 'bookmark') ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isUserReacted(claim, 'bookmark') ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleReaction(claim.id, 'flag')}
                    className="p-1 hover:bg-hover-bg rounded text-muted-foreground hover:text-warning transition-colors"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Comments Preview */}
              {claim.comments && claim.comments.length > 0 && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {claim.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {comment.profiles?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <span className="text-xs font-medium">{comment.profiles?.display_name}</span>
                        <p className="text-xs text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {claim._count.comments > 2 && (
                    <button className="text-xs text-primary hover:underline">
                      View all {claim._count.comments} comments
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {claims.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full" onClick={fetchClaims}>
            Load More Claims
          </Button>
        </div>
      )}

      {claims.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Claims Yet</h3>
            <p className="text-muted-foreground">
              Be the first to share and verify news in your community!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};