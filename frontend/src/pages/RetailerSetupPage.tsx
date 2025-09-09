import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface InvitationData {
  applicationId: string;
  email: string;
  shopName: string;
  timestamp: number;
}

const RetailerSetupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token));
      
      // Check if token is expired (24 hours)
      const tokenAge = Date.now() - decoded.timestamp;
      if (tokenAge > 24 * 60 * 60 * 1000) {
        setError('Invitation link has expired');
        setLoading(false);
        return;
      }

      setInvitationData(decoded);
    } catch (err) {
      setError('Invalid invitation token');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleCreateAccount = async () => {
    if (!invitationData) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsCreatingAccount(true);
    setError(null);

    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitationData.email,
        password: password,
        options: {
          data: {
            role: 'retailer',
            shop_name: invitationData.shopName,
            application_id: invitationData.applicationId
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Update the application status to indicate account created
      if (authData.user) {
        await supabase
          .from('retailer_applications')
          .update({
            user_id: authData.user.id,
            account_created_at: new Date().toISOString()
          })
          .eq('id', invitationData.applicationId);
      }

      // Show success message and redirect
      alert('Account created successfully! Please check your email to verify your account, then you can sign in.');
      navigate('/auth?tab=signin');

    } catch (err: any) {
      console.error('Account creation error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4" padding="lg">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4" padding="lg">
        <div className="text-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Neesh!</h2>
          <p className="text-gray-600">
            Your retailer application for <strong>{invitationData?.shopName}</strong> has been approved.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={invitationData?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Create Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            onClick={handleCreateAccount}
            disabled={isCreatingAccount || !password || !confirmPassword}
            loading={isCreatingAccount}
            className="w-full"
          >
            Create Account & Access Dashboard
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RetailerSetupPage;
