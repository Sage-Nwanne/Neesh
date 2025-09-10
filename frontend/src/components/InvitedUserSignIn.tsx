import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface InvitationData {
  applicationId: string;
  email: string;
  type: 'publisher' | 'retailer';
  timestamp: number;
}

const InvitedUserSignIn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: ''
  });

  useEffect(() => {
    const isInvited = searchParams.get('invited') === 'true';
    
    if (isInvited) {
      // Get invitation data from localStorage
      const storedInvitationData = localStorage.getItem('invitation_data');
      if (storedInvitationData) {
        try {
          const data = JSON.parse(storedInvitationData) as InvitationData;
          setInvitationData(data);
          setFormData(prev => ({ ...prev, email: data.email }));
        } catch (err) {
          setError('Invalid invitation data');
        }
      } else {
        setError('No invitation data found. Please use the invitation link from your email.');
      }
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username || !formData.fullName) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (invitationData && formData.email !== invitationData.email) {
      setError('Email must match the invitation email');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Here you would typically call your API to create the user account
      // For now, we'll simulate the process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear invitation data
      localStorage.removeItem('invitation_data');
      
      // Redirect to appropriate dashboard
      const dashboardPath = invitationData?.type === 'publisher' ? '/publisher/dashboard' : '/retailer/dashboard';
      navigate(dashboardPath);
      
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!invitationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            {error || 'You need a valid invitation to access this page.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
          <CheckCircle className="mx-auto h-12 w-12 mb-3" />
          <h1 className="text-xl font-bold mb-1">Welcome to NEESH!</h1>
          <p className="text-blue-100 text-sm">
            Create your {invitationData.type} account
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Please sign in to your account for the first time. Your credentials will be used for future logins.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="Your email address"
                disabled
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This email is from your approved application
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitedUserSignIn;
