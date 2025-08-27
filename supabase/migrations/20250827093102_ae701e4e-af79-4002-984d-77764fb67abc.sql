-- Create claims table for social media posts
CREATE TABLE public.claims (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'false', 'investigating')),
  confidence_score integer DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  urgency text DEFAULT 'low' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  source_url text,
  location text,
  is_new boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create claim_topics junction table
CREATE TABLE public.claim_topics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id uuid REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(claim_id, topic_id)
);

-- Create reactions table for likes, shares, etc.
CREATE TABLE public.reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  claim_id uuid REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'share', 'bookmark', 'flag')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, claim_id, reaction_type)
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  claim_id uuid REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Claims policies
CREATE POLICY "Claims are viewable by everyone" 
ON public.claims FOR SELECT USING (true);

CREATE POLICY "Users can create claims" 
ON public.claims FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims" 
ON public.claims FOR UPDATE 
USING (auth.uid() = user_id);

-- Claim topics policies
CREATE POLICY "Claim topics are viewable by everyone" 
ON public.claim_topics FOR SELECT USING (true);

CREATE POLICY "Users can manage topics for their claims" 
ON public.claim_topics FOR ALL 
USING (
  claim_id IN (
    SELECT id FROM public.claims WHERE user_id = auth.uid()
  )
);

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone" 
ON public.reactions FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reactions" 
ON public.reactions FOR ALL 
USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_claims_updated_at
  BEFORE UPDATE ON public.claims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample claims with different verification statuses
INSERT INTO public.topics (name, description, color, icon) VALUES
('Breaking News', 'Latest breaking news and urgent updates', '#ef4444', 'Zap'),
('Health & Safety', 'Health guidelines and safety information', '#10b981', 'Heart'),
('Technology', 'Tech news and digital literacy', '#3b82f6', 'Smartphone'),
('Environment', 'Climate and environmental updates', '#059669', 'Leaf'),
('Politics', 'Political news and fact-checking', '#8b5cf6', 'Building'),
('Finance', 'Economic news and financial tips', '#f59e0b', 'DollarSign')
ON CONFLICT (name) DO NOTHING;