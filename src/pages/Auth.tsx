import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Store } from 'lucide-react';

const Auth = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(signInForm.email, signInForm.password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Sign In Card */}
        <div>
        <Card>
          <CardHeader className="text-center space-y-4">
            <img 
              src="/lovable-uploads/992e135d-2d91-4435-9853-bb3ecc39d386.png" 
              alt="NEESH" 
              className="h-12 w-auto mx-auto"
            />
            <CardTitle className="text-h2 font-semibold text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-body text-muted-foreground">
              Sign in to your existing account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-body font-medium">Email</Label>
                <Input 
                  id="signin-email" 
                  type="email" 
                  value={signInForm.email} 
                  onChange={e => setSignInForm({
                    ...signInForm,
                    email: e.target.value
                  })} 
                  required 
                  className="text-body"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-body font-medium">Password</Label>
                <Input 
                  id="signin-password" 
                  type="password" 
                  value={signInForm.password} 
                  onChange={e => setSignInForm({
                    ...signInForm,
                    password: e.target.value
                  })} 
                  required 
                  className="text-body"
                />
              </div>
              <Button type="submit" className="w-full font-normal" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>

        {/* Application Selection */}
        <div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-h3 font-semibold text-primary">
              New to Neesh?
            </CardTitle>
            <CardDescription className="text-body text-muted-foreground">
              Apply to join our curated network. Choose your role to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div 
                className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate('/publisher-application')}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <FileText className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h4 className="text-body font-semibold text-foreground">Apply as Publisher</h4>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      List your magazine and reach retailers worldwide
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate('/retailer-application')}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Store className="h-10 w-10 text-primary" />
                  <div className="space-y-2">
                    <h4 className="text-body font-semibold text-foreground">Apply as Retailer</h4>
                    <p className="text-caption text-muted-foreground leading-relaxed">
                      Stock curated magazines with guaranteed returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-6 border-t border-border">
              <p className="text-caption text-muted-foreground mb-6 leading-relaxed">
                Have questions about joining Neesh?
              </p>
              <Button variant="ghost" className="text-primary font-medium" asChild>
                <a href="mailto:hi@neesh.art">
                  Talk to the Team
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;