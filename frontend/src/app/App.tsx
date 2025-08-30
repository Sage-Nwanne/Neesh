import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import CaseSensitiveCard from '@/components/CaseSensitiveCard';
import '../index.css';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
