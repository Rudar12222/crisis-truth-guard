import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Image as ImageIcon, 
  MapPin, 
  Link, 
  X,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const CreateClaimModal = ({ onClaimCreated }: { onClaimCreated?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      if (error) throw error;
      setAvailableTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    try {
      // Create the claim
      const { data: claim, error: claimError } = await supabase
        .from('claims')
        .insert({
          user_id: user.id,
          content: content.trim(),
          image_url: imageUrl || null,
          source_url: sourceUrl || null,
          location: location || null,
          urgency,
          verification_status: 'pending',
          confidence_score: 0,
          is_new: true
        })
        .select()
        .single();

      if (claimError) throw claimError;

      // Add topics if selected
      if (selectedTopics.length > 0 && claim) {
        const topicInserts = selectedTopics.map(topicId => ({
          claim_id: claim.id,
          topic_id: topicId
        }));

        const { error: topicsError } = await supabase
          .from('claim_topics')
          .insert(topicInserts);

        if (topicsError) throw topicsError;
      }

      toast({
        title: "Claim Posted",
        description: "Your claim has been submitted for verification",
      });

      // Reset form
      setContent('');
      setImageUrl('');
      setSourceUrl('');
      setLocation('');
      setUrgency('low');
      setSelectedTopics([]);
      setOpen(false);
      
      onClaimCreated?.();
    } catch (error) {
      console.error('Error creating claim:', error);
      toast({
        title: "Error",
        description: "Failed to create claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={fetchTopics}
          className="w-full md:w-auto"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Share Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share a New Claim</DialogTitle>
          <DialogDescription>
            Share news, information, or claims that need verification
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              placeholder="What's the news or claim you'd like to share..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Image URL (Optional)
            </label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              type="url"
            />
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-w-full h-32 object-cover rounded border"
                  onError={() => setImageUrl('')}
                />
              </div>
            )}
          </div>

          {/* Source URL */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center">
              <Link className="h-4 w-4 mr-2" />
              Source URL (Optional)
            </label>
            <Input
              placeholder="https://source.com/article"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              type="url"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location (Optional)
            </label>
            <Input
              placeholder="City, State or Region"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="text-sm font-medium mb-2 block">Urgency Level</label>
            <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General Information</SelectItem>
                <SelectItem value="medium">Medium - Important</SelectItem>
                <SelectItem value="high">High - Urgent</SelectItem>
                <SelectItem value="critical">Critical - Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics */}
          <div>
            <label className="text-sm font-medium mb-2 block">Topics</label>
            {loadingTopics ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTopics.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant={selectedTopics.includes(topic.id) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/10"
                    style={{
                      borderColor: topic.color,
                      backgroundColor: selectedTopics.includes(topic.id) ? topic.color : 'transparent',
                      color: selectedTopics.includes(topic.id) ? 'white' : topic.color
                    }}
                    onClick={() => toggleTopic(topic.id)}
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Claim'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};