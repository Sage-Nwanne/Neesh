import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import styles from './AdminLogin.module.css';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Only allow password reset for gem@neesh.art
    const allowedEmail = 'gem@neesh.art';

    setResetLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(allowedEmail, {
        redirectTo: `${window.location.origin}/admin-panel?reset=true`,
      });

      if (error) {
        setError('Failed to send reset email. Please try again.');
      } else {
        setResetEmailSent(true);
        setError('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logo} />
          <h1>Admin Panel Access</h1>
          <p>Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gem@neesh.art"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.forgotPassword}>
          {!showForgotPassword ? (
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={styles.forgotPasswordLink}
            >
              Forgot Password?
            </button>
          ) : (
            <div className={styles.forgotPasswordSection}>
              {!resetEmailSent ? (
                <>
                  <p className={styles.forgotPasswordText}>
                    Password reset will be sent to the owner's email (gem@neesh.art)
                  </p>
                  <div className={styles.forgotPasswordActions}>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resetLoading}
                      className={styles.resetButton}
                    >
                      <Mail size={16} />
                      {resetLoading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.resetSuccess}>
                  <Mail size={24} />
                  <p>Password reset email sent to gem@neesh.art</p>
                  <p className={styles.resetSuccessSubtext}>
                    Check your email for reset instructions
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmailSent(false);
                    }}
                    className={styles.backToLoginButton}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.loginFooter}>
          <p>For security purposes, only authorized personnel can access this panel.</p>
          <p>If you need access, contact the system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
