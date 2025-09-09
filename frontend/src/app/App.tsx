import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import CaseSensitiveCard from '@/components/CaseSensitiveCard';
import { Toaster } from 'sonner';
import { usePageTracking } from '@/hooks/useAnalytics';
import AnalyticsDebugger from '@/components/dev/AnalyticsDebugger';
import '../index.css';

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnalyticsWrapper>
          <AuthProvider>
            <div className="App min-h-screen bg-gray-50">
              <AppRouter />
              <CaseSensitiveCard
                delayMs={4000}
                hideForDays={7}
                placement="br"
                triggerOnScroll={false}
                scrollThreshold={20}
              />
              <Toaster />
              <AnalyticsDebugger />
            </div>
          </AuthProvider>
        </AnalyticsWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
