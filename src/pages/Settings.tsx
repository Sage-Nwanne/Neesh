import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Shield, Bell, CreditCard, Users, AlertTriangle, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Settings() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      
      // First, delete the user's profile and related data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw authError;

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted"
      });

      await signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .or(`retailer_id.eq.${user.id},publisher_id.eq.${user.id}`);

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      const exportData = {
        profile: profileData,
        orders: ordersData,
        messages: messagesData,
        exported_at: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neesh-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gradient">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    View and manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={user?.email || ''} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {profile?.role}
                        </Badge>
                        {profile?.verified && (
                          <Badge variant="default">Verified</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <Input 
                        value={new Date(profile?.created_at || '').toLocaleDateString()} 
                        disabled 
                        className="bg-muted" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <Badge variant={profile?.status === 'approved' ? 'default' : 'secondary'}>
                        {profile?.status || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>
                    Download a copy of your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Account Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download all your account data in JSON format
                      </p>
                    </div>
                    <Button onClick={exportData} disabled={loading}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handlePasswordChange} 
                      disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    >
                      Update Password
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    {twoFactorEnabled && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Two-factor authentication setup will be available in a future update.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Deleting your account will permanently remove all your data and cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing & Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your billing information and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-4">
                      You're currently on the free plan. Upgrade to unlock premium features.
                    </p>
                    <Button>Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">
                          Allow other users to find and view your profile
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Contact Information</p>
                        <p className="text-sm text-muted-foreground">
                          Show your contact details to verified partners
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Business Analytics</p>
                        <p className="text-sm text-muted-foreground">
                          Share anonymized data to help improve the platform
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive promotional emails and updates
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Processing</CardTitle>
                  <CardDescription>
                    Information about how we process your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      We process your data to provide our services and improve your experience. 
                      You can request a copy of your data or ask us to delete it at any time.
                    </p>
                    <p>
                      For more information, please read our{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>.
                    </p>
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