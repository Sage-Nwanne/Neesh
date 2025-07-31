import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Clock, Mail, MailCheck, Settings, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'system' | 'payment';
  read: boolean;
  created_at: string;
  action_url?: string;
}

interface NotificationPreferences {
  email_orders: boolean;
  email_messages: boolean;
  email_system: boolean;
  push_orders: boolean;
  push_messages: boolean;
  push_system: boolean;
}

export default function Notifications() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_orders: true,
    email_messages: true,
    email_system: true,
    push_orders: true,
    push_messages: true,
    push_system: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          toast.success('New notification received');
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const updatePreferences = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences
        });

      if (error) throw error;

      setPreferences(newPreferences);
      toast.success('Preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'message':
        return '💬';
      case 'payment':
        return '💳';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your business activities
            </p>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <MailCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <button
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    activeTab === 'all' ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  <div className="flex items-center justify-between">
                    <span>All Notifications</span>
                    <Badge variant="secondary">{notifications.length}</Badge>
                  </div>
                </button>
                <button
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    activeTab === 'unread' ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveTab('unread')}
                >
                  <div className="flex items-center justify-between">
                    <span>Unread</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive">{unreadCount}</Badge>
                    )}
                  </div>
                </button>
                <Separator className="my-2" />
                <button
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    activeTab === 'settings' ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'settings' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about order status changes
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email_orders}
                          onCheckedChange={(checked) => updatePreferences('email_orders', checked)}
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
                          checked={preferences.email_messages}
                          onCheckedChange={(checked) => updatePreferences('email_messages', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Important system announcements and updates
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email_system}
                          onCheckedChange={(checked) => updatePreferences('email_system', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Real-time order notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_orders}
                          onCheckedChange={(checked) => updatePreferences('push_orders', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-muted-foreground">
                            Instant message notifications
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_messages}
                          onCheckedChange={(checked) => updatePreferences('push_messages', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Updates</p>
                          <p className="text-sm text-muted-foreground">
                            System maintenance and updates
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push_system}
                          onCheckedChange={(checked) => updatePreferences('push_system', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'all' ? 'All Notifications' : 'Unread Notifications'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                          !notification.read ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-2xl">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <Badge variant="destructive" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredNotifications.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications found</p>
                        <p className="text-sm">
                          {activeTab === 'unread' 
                            ? "You're all caught up!" 
                            : "Notifications will appear here when you receive them"
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}