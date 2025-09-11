import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'owner';
  name: string;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);

  useEffect(() => {
    // Check if user is already authenticated with Supabase
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user && session.user.app_metadata?.role === 'admin') {
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.app_metadata.role,
          name: session.user.user_metadata?.name || 'Admin'
        };

        setAdminUser(adminUser);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.app_metadata?.role === 'admin') {
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.app_metadata.role,
          name: session.user.user_metadata?.name || 'Admin'
        };

        setAdminUser(adminUser);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      // Check if user has admin role
      if (data.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        console.error('User does not have admin role');
        return false;
      }

      // User will be set via the auth state change listener
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    adminUser,
    isLoading,
    login,
    logout
  };
};
