import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Users, CheckCircle, Search, AlertTriangle, TrendingUp, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-verification.jpg";

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/app");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FactStream
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 z-0" />
        <div className="absolute inset-0 opacity-10 z-0">
          <img 
            src={heroImage} 
            alt="People fact-checking news with digital verification" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            🚀 Real-time misinformation detection
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Combat Misinformation with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AI-Powered Verification
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the fight against fake news with our real-time verification platform. 
            Get instant fact-checks, connect with trusted sources, and stay informed during crises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 shadow-elegant" onClick={() => navigate("/auth")}>
              <Shield className="mr-2 h-5 w-5" />
              Start Verifying News
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 backdrop-blur-sm">
              <Search className="mr-2 h-5 w-5" />
              Explore Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Truth Seekers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with human expertise to deliver 
              real-time fact-checking and misinformation detection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Verification</CardTitle>
                <CardDescription>
                  Instant fact-checking powered by advanced AI algorithms and verified sources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Social Verification</CardTitle>
                <CardDescription>
                  Connect with a community of fact-checkers and trusted news sources.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Crisis Monitoring</CardTitle>
                <CardDescription>
                  Stay ahead of misinformation during emergencies and breaking news events.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trending Analysis</CardTitle>
                <CardDescription>
                  Track misinformation patterns and emerging narratives across social platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global Coverage</CardTitle>
                <CardDescription>
                  Monitor news and misinformation across multiple languages and regions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verified Sources</CardTitle>
                <CardDescription>
                  Access a curated network of trusted journalists and fact-checking organizations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How FactStream Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple, powerful, and effective fact-checking in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Submit</h3>
              <p className="text-muted-foreground">
                Submit news articles, social media posts, or any claims you want to verify.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI instantly cross-references claims with verified databases and trusted sources.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant verification results with source citations and confidence scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fight Misinformation?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust FactStream to keep them informed with verified, 
            accurate news during critical moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/auth")}>
              <Shield className="mr-2 h-5 w-5" />
              Create Free Account
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">FactStream</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
            © 2024 FactStream. All rights reserved. Combating misinformation with AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;