import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, Globe, Instagram, MessageSquare, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Partner {
  id: string;
  business_name: string;
  role: 'publisher' | 'retailer';
  bio: string;
  location: string;
  website: string;
  instagram: string;
  specialties: string[];
  rating: number;
  total_orders: number;
  verified: boolean;
  created_at: string;
}

export default function Partners() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPartners();
    }
  }, [user]);

  useEffect(() => {
    filterPartners();
  }, [partners, searchQuery, selectedSpecialty]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      
      // Fetch partners of opposite role
      const targetRole = profile?.role === 'publisher' ? 'retailer' : 'publisher';
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          business_name,
          role,
          bio,
          location,
          website,
          instagram,
          specialties,
          verified,
          created_at
        `)
        .eq('role', targetRole)
        .eq('status', 'approved')
        .neq('id', user.id);

      if (error) throw error;

      // Fetch additional stats for each partner
      const partnersWithStats = await Promise.all(
        (data || []).map(async (partner) => {
          const { data: orderStats } = await supabase
            .from('orders')
            .select('id')
            .eq(partner.role === 'publisher' ? 'publisher_id' : 'retailer_id', partner.id);

          return {
            ...partner,
            total_orders: orderStats?.length || 0,
            rating: 4.5 + Math.random() * 0.5, // Mock rating for now
          };
        })
      );

      setPartners(partnersWithStats);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: "Error",
        description: "Failed to load partners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(partner =>
        partner.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(partner =>
        partner.specialties.includes(selectedSpecialty)
      );
    }

    setFilteredPartners(filtered);
  };

  const getAllSpecialties = () => {
    const specialties = new Set<string>();
    partners.forEach(partner => {
      partner.specialties.forEach(specialty => specialties.add(specialty));
    });
    return Array.from(specialties).sort();
  };

  const startConversation = async (partnerId: string, partnerName: string) => {
    try {
      const { data: existingThread, error: searchError } = await supabase
        .from('message_threads')
        .select('id')
        .contains('participants', [user.id, partnerId])
        .single();

      if (searchError && searchError.code !== 'PGRST116') throw searchError;

      if (existingThread) {
        // Thread exists, navigate to messages
        window.location.href = `/messages?thread=${existingThread.id}`;
        return;
      }

      // Create new thread
      const { data: thread, error: threadError } = await supabase
        .from('message_threads')
        .insert([
          {
            subject: `Conversation with ${partnerName}`,
            participants: [user.id, partnerId],
            last_message_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (threadError) throw threadError;

      // Create initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            content: `Hi ${partnerName}, I'd like to connect with you!`,
            sender_id: user.id,
            recipient_id: partnerId,
            thread_id: thread.id
          }
        ]);

      if (messageError) throw messageError;

      toast({
        title: "Success",
        description: "Conversation started successfully"
      });

      // Navigate to messages
      window.location.href = `/messages?thread=${thread.id}`;
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              {profile?.role === 'publisher' ? 'Retailers' : 'Publishers'}
            </h1>
            <p className="text-muted-foreground">
              Connect with verified {profile?.role === 'publisher' ? 'retailers' : 'publishers'} in our network
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, location, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="all">All Specialties</option>
                  {getAllSpecialties().map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {partner.business_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{partner.business_name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {partner.role}
                          </Badge>
                          {partner.verified && (
                            <Badge variant="default" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {partner.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {partner.bio}
                  </p>

                  <div className="space-y-2">
                    {partner.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {partner.location}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {partner.total_orders} orders completed
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1">
                    {partner.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {partner.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{partner.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    {partner.website && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={partner.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {partner.instagram && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`https://instagram.com/${partner.instagram}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => startConversation(partner.id, partner.business_name)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="default" size="sm" className="flex-1" asChild>
                      <Link to={`/partners/${partner.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No partners found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedSpecialty !== 'all'
                    ? 'Try adjusting your search criteria'
                    : 'No verified partners available at the moment'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}