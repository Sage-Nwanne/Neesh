import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if admin is already authenticated
    const adminToken = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_user');
    
    if (adminToken && adminData) {
      try {
        const user = JSON.parse(adminData);
        setAdminUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For now, use simple hardcoded authentication
      // In production, this should call a secure API endpoint
      const validCredentials = [
        { email: 'admin@neesh.art', password: 'neeshis@dmin', role: 'admin' as const, name: 'NEESH Admin' },
        { email: 'owner@neesh.art', password: 'neesh2024owner', role: 'owner' as const, name: 'Owner' }
      ];

      const user = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (user) {
        const adminUser: AdminUser = {
          id: '1',
          email: user.email,
          role: user.role,
          name: user.name
        };

        setAdminUser(adminUser);
        setIsAuthenticated(true);

        // Store a simple token for API calls (in production, use secure JWT)
        const simpleToken = btoa(JSON.stringify({ email: user.email, role: user.role, userId: '1' }));
        localStorage.setItem('admin_token', simpleToken);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAdminUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return {
    isAuthenticated,
    adminUser,
    isLoading,
    login,
    logout
  };
};
