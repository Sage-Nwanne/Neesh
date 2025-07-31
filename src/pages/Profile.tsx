import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Building, MapPin, Globe, Instagram, Mail, Phone, Save, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  business_name: string;
  bio: string;
  location: string;
  website: string;
  instagram: string;
  phone: string;
  specialties: string[];
  business_hours: any;
  notification_preferences: any;
}

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    business_name: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    phone: '',
    specialties: [],
    business_hours: {},
    notification_preferences: {}
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileData({
        business_name: profile.business_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
        phone: profile.phone || '',
        specialties: profile.specialties || [],
        business_hours: profile.business_hours || {},
        notification_preferences: profile.notification_preferences || {}
      });
      setLoading(false);
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profileData.specialties.includes(newSpecialty.trim())) {
      setProfileData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value
        }
      }
    }));
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value
      }
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your business profile and preferences
              </p>
            </div>
            <Button onClick={saveProfile} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Update your basic profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-lg">
                        {profileData.business_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-medium">{profileData.business_name}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {profile?.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        value={profileData.business_name}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                        placeholder="Your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell others about your business..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Tab */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Details
                  </CardTitle>
                  <CardDescription>
                    Manage your business information and specialties
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          value={profileData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                          placeholder="@yourusername"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                          {specialty}
                          <button
                            onClick={() => removeSpecialty(specialty)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="Add a specialty..."
                        onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                      />
                      <Button onClick={addSpecialty} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Hours Tab */}
            <TabsContent value="hours" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>
                    Set your operating hours for each day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {days.map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={profileData.business_hours[day]?.open || ''}
                          onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={profileData.business_hours[day]?.close || ''}
                          onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                          className="w-32"
                        />
                        <Switch
                          checked={profileData.business_hours[day]?.closed !== true}
                          onCheckedChange={(checked) => 
                            updateBusinessHours(day, 'closed', !checked)
                          }
                        />
                        <Label className="text-sm text-muted-foreground">Open</Label>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new orders and status changes
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notification_preferences.email_orders !== false}
                          onCheckedChange={(checked) => 
                            updateNotificationPreference('email_orders', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for new messages
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notification_preferences.email_messages !== false}
                          onCheckedChange={(checked) => 
                            updateNotificationPreference('email_messages', checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notification_preferences.email_marketing === true}
                          onCheckedChange={(checked) => 
                            updateNotificationPreference('email_marketing', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Push Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Real-time Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get instant notifications for important events
                          </p>
                        </div>
                        <Switch
                          checked={profileData.notification_preferences.push_enabled !== false}
                          onCheckedChange={(checked) => 
                            updateNotificationPreference('push_enabled', checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}