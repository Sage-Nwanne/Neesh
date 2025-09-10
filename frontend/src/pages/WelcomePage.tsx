import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface InvitationData {
  applicationId: string;
  email: string;
  type: 'publisher' | 'retailer';
  timestamp: number;
}

const WelcomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No invitation token provided');
      setIsLoading(false);
      return;
    }

    try {
      // Decode the invitation token
      const decodedData = JSON.parse(atob(token)) as InvitationData;
      
      // Check if token is expired (7 days)
      const tokenAge = Date.now() - decodedData.timestamp;
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (tokenAge > sevenDaysInMs) {
        setError('This invitation link has expired. Please contact hi@neesh.art for a new invitation.');
        setIsLoading(false);
        return;
      }

      setInvitationData(decodedData);
      setIsValidToken(true);
      setIsLoading(false);
    } catch (err) {
      setError('Invalid invitation token');
      setIsLoading(false);
    }
  }, [searchParams]);

  const handleProceedToSignIn = () => {
    // Store invitation data in localStorage for the sign-in process
    if (invitationData) {
      localStorage.setItem('invitation_data', JSON.stringify(invitationData));
    }
    
    // Redirect to sign-in page
    navigate('/retailer-application?mode=signin&invited=true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !isValidToken || !invitationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This invitation link is not valid or has expired.'}
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
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
          <CheckCircle className="mx-auto h-16 w-16 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome to NEESH!</h1>
          <p className="text-blue-100">
            Your {invitationData.type} application has been approved
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-600">
              You're now part of the NEESH community. Let's get you set up with your account.
            </p>
          </div>

          {/* Account Setup Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Sign In" below to access your dashboard</li>
              <li>2. Sign in for the first time using your preferred credentials</li>
              <li>3. Complete your profile setup</li>
              <li>4. {invitationData.type === 'publisher' ? 'Start listing your magazines!' : 'Start browsing our magazine catalog!'}</li>
            </ol>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Account Details:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> {invitationData.email}</p>
              <p><strong>Account Type:</strong> {invitationData.type.charAt(0).toUpperCase() + invitationData.type.slice(1)}</p>
              <p><strong>Application ID:</strong> {invitationData.applicationId}</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedToSignIn}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold"
          >
            Sign In to Your Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:hi@neesh.art" className="text-blue-600 hover:text-blue-700">
                hi@neesh.art
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            This invitation link will expire in 7 days from when it was sent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
