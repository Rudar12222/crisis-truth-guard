import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, User, Hash, MapPin, Globe, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
}

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    display_name: "",
    username: "",
    bio: "",
    location: "",
    website: ""
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication and load existing profile if any
    const initializeOnboarding = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user already has a complete profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (existingProfile && existingProfile.display_name) {
        // Check if user has selected topics
        const { data: userTopics } = await supabase
          .from("user_topics")
          .select("topic_id")
          .eq("user_id", session.user.id);

        if (userTopics && userTopics.length > 0) {
          navigate("/app"); // User has completed onboarding
          return;
        } else {
          setStep(2); // Skip profile setup, go to topic selection
        }
      }

      // Pre-fill profile with auth data if available
      const authProfile = {
        display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
        username: existingProfile?.username || "",
        bio: "",
        location: "",
        website: ""
      };
      setProfile(authProfile);

      // Load available topics
      const { data: topicsData } = await supabase
        .from("topics")
        .select("*")
        .order("name");

      if (topicsData) {
        setTopics(topicsData);
      }
    };

    initializeOnboarding();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: session.user.id,
          display_name: profile.display_name,
          username: profile.username,
          bio: profile.bio,
          location: profile.location,
          website: profile.website
        });

      if (error) throw error;

      setStep(2);
      toast({
        title: "Profile updated!",
        description: "Now let's personalize your feed with topics you're interested in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleTopicsSubmit = async () => {
    if (selectedTopics.length === 0) {
      toast({
        title: "Select topics",
        description: "Please select at least one topic to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Delete existing user topics
      await supabase
        .from("user_topics")
        .delete()
        .eq("user_id", session.user.id);

      // Insert new user topics
      const userTopicsData = selectedTopics.map(topicId => ({
        user_id: session.user.id,
        topic_id: topicId
      }));

      const { error } = await supabase
        .from("user_topics")
        .insert(userTopicsData);

      if (error) throw error;

      toast({
        title: "Welcome to FactStream!",
        description: "Your personalized feed is ready.",
      });

      navigate("/app");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <User className="h-6 w-6 text-primary" />
              <span>Complete Your Profile</span>
            </CardTitle>
            <CardDescription>
              Let's set up your profile so others can find and recognize you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Upload Placeholder */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-lg bg-primary/10">
                    {profile.display_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input
                  id="display_name"
                  placeholder="Your full name"
                  value={profile.display_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="your_username"
                    className="pl-10"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, Country"
                    className="pl-10"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleProfileUpdate}
              disabled={loading || !profile.display_name || !profile.username}
            >
              {loading ? "Saving..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span>Choose Your Interests</span>
          </CardTitle>
          <CardDescription>
            Select topics you're interested in to personalize your news feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTopics.includes(topic.id)
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleTopicToggle(topic.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{topic.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {topic.description}
                      </p>
                    </div>
                    {selectedTopics.includes(topic.id) && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTopics.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Topics ({selectedTopics.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topicId) => {
                  const topic = topics.find(t => t.id === topicId);
                  return topic ? (
                    <Badge key={topicId} variant="secondary" className="text-sm">
                      {topic.icon} {topic.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleTopicsSubmit}
              disabled={loading || selectedTopics.length === 0}
              className="flex-1"
            >
              {loading ? "Finishing setup..." : "Complete Setup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;