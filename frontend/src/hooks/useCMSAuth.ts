import { useState, useEffect } from 'react';

interface CMSUser {
  email: string;
  isAuthenticated: boolean;
}

const CMS_AUTH_KEY = 'cms_auth_session';
const VALID_EMAIL = 'gem@neesh.art';
const VALID_PASSWORD = 'neeshis@dmin';

export const useCMSAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem(CMS_AUTH_KEY);
        if (authData) {
          const parsed = JSON.parse(authData);
          const now = Date.now();
          
          // Check if session is still valid (24 hours)
          if (parsed.expires > now && parsed.email === VALID_EMAIL) {
            setIsAuthenticated(true);
          } else {
            // Session expired, remove it
            localStorage.removeItem(CMS_AUTH_KEY);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem(CMS_AUTH_KEY);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simple credential check
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        // Create session that expires in 24 hours
        const sessionData = {
          email: VALID_EMAIL,
          expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          timestamp: Date.now()
        };
        
        localStorage.setItem(CMS_AUTH_KEY, JSON.stringify(sessionData));
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CMS_AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
