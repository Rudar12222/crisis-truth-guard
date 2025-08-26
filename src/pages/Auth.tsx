import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Facebook, Chrome, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleEmailAuth = async (type: 'signin' | 'signup') => {
    if (type === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (type === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`
          }
        });

        if (signUpError) {
          if (signUpError.message.includes("already registered")) {
            setError("This email is already registered. Please try signing in instead.");
          } else {
            setError(signUpError.message);
          }
        } else {
          setMessage("Check your email for the confirmation link!");
          toast({
            title: "Success!",
            description: "Please check your email for confirmation link",
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          if (signInError.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please check your credentials.");
          } else {
            setError(signInError.message);
          }
        } else {
          navigate("/app");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Failed to authenticate with " + provider);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FactStream
            </h1>
          </div>
          <p className="text-muted-foreground">
            Real-time news verification platform
          </p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Social Auth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth('google')}
                  disabled={loading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialAuth('facebook')}
                  disabled={loading}
                >
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or continue with email
                  </span>
                </div>
              </div>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleEmailAuth('signin')}
                    disabled={loading || !email || !password}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleEmailAuth('signup')}
                    disabled={loading || !email || !password || !confirmPassword}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;