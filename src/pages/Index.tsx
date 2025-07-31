import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Users, BarChart3, MessageSquare, FileText } from "lucide-react";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartSidebar } from "@/components/cart/CartSidebar";
import heroMagazines from "@/assets/hero-magazines.jpg";

export default function Index() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 max-w-[1280px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/992e135d-2d91-4435-9853-bb3ecc39d386.png" 
                alt="NEESH" 
                className="h-8 w-auto"
              />
              {user && (
                <nav className="hidden md:flex items-center gap-8 ml-12">
                  <Link to="/" className="text-body text-foreground hover:text-primary transition-colors story-link">
                    Dashboard
                  </Link>
                  {profile?.role === 'publisher' && (
                    <Link to="/products" className="text-body text-foreground hover:text-primary transition-colors story-link">
                      Products
                    </Link>
                  )}
                  <Link to="/marketplace" className="text-body text-foreground hover:text-primary transition-colors story-link">
                    Marketplace
                  </Link>
                  <Link to="/orders" className="text-body text-foreground hover:text-primary transition-colors story-link">
                    Orders
                  </Link>
                  {profile?.role === 'publisher' && (
                    <Link to="/analytics" className="text-body text-foreground hover:text-primary transition-colors story-link">
                      Analytics
                    </Link>
                  )}
                </nav>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  {profile?.role === 'retailer' && <CartIcon />}
                  <span className="text-caption text-muted-foreground hidden md:block">
                    Welcome, {profile?.business_name || user.email}
                  </span>
                  <Button variant="outline" onClick={signOut} className="text-tag">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/auth" className="text-body text-foreground hover:text-primary transition-colors">
                    Sign In
                  </Link>
                  <Link to="/publisher-application">
                    <Button variant="default">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {user ? (
        // Authenticated user sees their dashboard
        <main className="container mx-auto px-6 py-16 max-w-[1280px]">
          <div className="space-y-16">
            <div className="text-left space-y-8">
              <h2 className="text-h2 font-semibold text-primary">
                Welcome to your {profile?.role === 'publisher' ? 'Publishing' : 'Retail'} Dashboard
              </h2>
              <p className="text-body text-muted-foreground max-w-2xl leading-relaxed">
                {profile?.role === 'publisher' 
                  ? 'Manage your products, track orders, and connect with retailers'
                  : 'Discover products, manage orders, and grow your business'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {profile?.role === 'publisher' && (
                <Link to="/products">
                  <Card className="magazine-card hover-scale cursor-pointer group">
                    <CardContent className="p-8 text-center">
                      <Package className="h-12 w-12 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-semibold mb-3">Products</h3>
                      <p className="text-muted-foreground">Manage your catalog</p>
                    </CardContent>
                  </Card>
                </Link>
              )}
              
              <Link to="/partners">
                <Card className="magazine-card hover-scale cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold mb-3">
                      {profile?.role === 'publisher' ? 'Retailers' : 'Publishers'}
                    </h3>
                    <p className="text-muted-foreground">Connect with partners</p>
                  </CardContent>
                </Card>
              </Link>
              
              {profile?.role === 'publisher' && (
                <Link to="/analytics">
                  <Card className="magazine-card hover-scale cursor-pointer group">
                    <CardContent className="p-8 text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-semibold mb-3">Analytics</h3>
                      <p className="text-muted-foreground">Track performance</p>
                    </CardContent>
                  </Card>
                </Link>
              )}

              {profile?.role === 'publisher' && (
                <Link to="/apply">
                  <Card className="magazine-card hover-scale cursor-pointer group">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-semibold mb-3">Apply to Neesh</h3>
                      <p className="text-muted-foreground">Submit new issues</p>
                    </CardContent>
                  </Card>
                </Link>
              )}
              
              <Link to="/messages">
                <Card className="magazine-card hover-scale cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold mb-3">Messages</h3>
                    <p className="text-muted-foreground">Communication hub</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      ) : (
        // New homepage for unauthenticated users
        <main>
          {/* Enhanced Hero / Intro Block */}
          <section className="container mx-auto px-6 py-24 md:py-32 max-w-[1280px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-6">
                  <h1 className="text-h1 font-extrabold text-primary leading-tight">
                    The OS for Indie Print
                  </h1>
                  <p className="text-h3 font-medium text-muted-foreground leading-relaxed">
                    Built for publishers. Trusted by shops. Designed to move magazines.
                  </p>
                </div>
                
                {/* Stats row for credibility */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-h3 font-bold text-primary">50+</div>
                    <div className="text-caption text-muted-foreground">Publishers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-h3 font-bold text-primary">200+</div>
                    <div className="text-caption text-muted-foreground">Retailers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-h3 font-bold text-primary">10k+</div>
                    <div className="text-caption text-muted-foreground">Magazines Moved</div>
                  </div>
                </div>

                <div className="pt-6">
                  <a 
                    href="#how-it-works" 
                    className="inline-flex items-center gap-2 text-body font-medium text-primary story-link group"
                  >
                    Explore Neesh
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
              
              <div className="relative animate-fade-in">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant hover-scale">
                  <img 
                    src={heroMagazines} 
                    alt="Stack of independent magazines" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-background border border-border rounded-xl p-4 shadow-lg">
                  <div className="text-caption font-medium text-muted-foreground">Curated Collection</div>
                  <div className="text-body font-semibold text-primary">Quality Over Quantity</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
      
      <CartSidebar />
    </div>
  );
}