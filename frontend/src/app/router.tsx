import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const AuthPage = React.lazy(() => import('@/features/auth/pages/AuthPage'));
const PublisherApplicationPage = React.lazy(() => import('@/features/publisher/pages/ApplicationPage'));
const PublisherDashboardPage = React.lazy(() => import('@/features/publisher/pages/DashboardPage'));
const RetailerDashboardPage = React.lazy(() => import('@/features/retailer/pages/DashboardPage'));
const RetailerMagazineOverviewPage = React.lazy(() => import('@/features/retailer/pages/MagazineOverviewPage'));
const RetailerSetupPage = React.lazy(() => import('@/pages/RetailerSetupPage'));
const MarketplacePage = React.lazy(() => import('@/features/marketplace/pages/MarketplacePage'));
const AdminPanelPage = React.lazy(() => import('@/pages/AdminPanel'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const FAQPage = React.lazy(() => import('@/pages/FAQPage'));
const WhyNeeshPage = React.lazy(() => import('@/pages/WhyNeeshPage'));
const DashboardComingSoonPage = React.lazy(() => import('@/pages/DashboardComingSoonPage'));
const RetailerDashboardComingSoonPage = React.lazy(() => import('@/pages/RetailerDashboardComingSoonPage'));
const ApiTestPage = React.lazy(() => import('@/pages/ApiTest'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// Loading component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Protected route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'publisher' | 'retailer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/publisher-application" element={<PublisherApplicationPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/why-neesh" element={<WhyNeeshPage />} />
        <Route path="/dashboard-coming-soon" element={<DashboardComingSoonPage />} />
        <Route path="/retailer-setup" element={<RetailerSetupPage />} />
        <Route path="/retailer-dashboard-coming-soon" element={<RetailerDashboardComingSoonPage />} />

        {/* Temporary public admin panel for testing */}
        <Route path="/admin-panel" element={<AdminPanelPage />} />

        {/* API Test page for debugging */}
        <Route path="/api-test" element={<ApiTestPage />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Publisher routes */}
        <Route
          path="/publisher-dashboard"
          element={
            <ProtectedRoute requiredRole="publisher">
              <PublisherDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Retailer routes */}
        <Route
          path="/retailer-dashboard"
          element={
            <ProtectedRoute requiredRole="retailer">
              <RetailerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/retailer-dashboard/magazine/:id"
          element={
            <ProtectedRoute requiredRole="retailer">
              <RetailerMagazineOverviewPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes - Protected version (commented out for testing) */}
        {/*
        <Route
          path="/admin-panel-protected"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        */}

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};
