import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';

// Hook for automatic page view tracking
export const usePageTracking = () => {
  const location = useLocation();
  const previousLocation = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Track page view
    analytics.trackPageView(
      document.title,
      window.location.href
    );

    // Track navigation if we have a previous location
    if (previousLocation.current && previousLocation.current !== currentPath) {
      analytics.trackNavigation(previousLocation.current, currentPath);
    }

    previousLocation.current = currentPath;
  }, [location]);
};

// Hook for tracking user interactions
export const useAnalytics = () => {
  return {
    // Authentication tracking
    trackSignUp: (userType: 'publisher' | 'retailer') => {
      analytics.trackSignUp(userType);
    },

    trackSignIn: (userType: 'publisher' | 'retailer' | 'admin') => {
      analytics.trackSignIn(userType);
    },

    trackSignOut: () => {
      analytics.trackSignOut();
    },

    // Application tracking
    trackApplicationSubmission: (applicationType: 'publisher' | 'retailer', applicationId?: string) => {
      analytics.trackApplicationSubmission(applicationType, applicationId);
    },

    trackApplicationApproval: (applicationType: 'publisher' | 'retailer', applicationId: string) => {
      analytics.trackApplicationApproval(applicationType, applicationId);
    },

    trackApplicationDenial: (applicationType: 'publisher' | 'retailer', applicationId: string) => {
      analytics.trackApplicationDenial(applicationType, applicationId);
    },

    // E-commerce tracking
    trackOrderCreation: (orderId: string, magazineTitle: string, quantity: number, value: number) => {
      analytics.trackOrderCreation(orderId, magazineTitle, quantity, value);
    },

    trackMagazineView: (magazineId: string, magazineTitle: string) => {
      analytics.trackMagazineView(magazineId, magazineTitle);
    },

    // Dashboard tracking
    trackDashboardView: (dashboardType: 'publisher' | 'retailer' | 'admin') => {
      analytics.trackDashboardView(dashboardType);
    },

    // Search tracking
    trackSearchQuery: (searchTerm: string, resultsCount?: number) => {
      analytics.trackSearchQuery(searchTerm, resultsCount);
    },

    // Error tracking
    trackError: (errorMessage: string, errorCategory?: string) => {
      analytics.trackError(errorMessage, errorCategory);
    },

    // Performance tracking
    trackPerformance: (metricName: string, value: number) => {
      analytics.trackPerformance(metricName, value);
    },

    // Conversion tracking
    trackConversion: (conversionType: string, value?: number) => {
      analytics.trackConversion(conversionType, value);
    },

    // Custom event tracking
    trackCustomEvent: (action: string, category: string, label?: string, value?: number) => {
      analytics.trackEvent({
        action,
        category,
        label,
        value,
      });
    },

    // Set user properties
    setUserProperties: (properties: {
      user_type?: 'publisher' | 'retailer' | 'admin' | 'visitor';
      user_id?: string;
      shop_name?: string;
      business_name?: string;
    }) => {
      analytics.setUserProperties(properties);
    },
  };
};

// Hook for tracking component mount/unmount
export const useComponentTracking = (componentName: string) => {
  const { trackCustomEvent } = useAnalytics();

  useEffect(() => {
    trackCustomEvent('component_mount', 'engagement', componentName);

    return () => {
      trackCustomEvent('component_unmount', 'engagement', componentName);
    };
  }, [componentName, trackCustomEvent]);
};

// Hook for tracking form interactions
export const useFormTracking = (formName: string) => {
  const { trackCustomEvent } = useAnalytics();

  return {
    trackFormStart: () => {
      trackCustomEvent('form_start', 'forms', formName);
    },

    trackFormStep: (stepNumber: number, stepName?: string) => {
      trackCustomEvent('form_step', 'forms', `${formName}_step_${stepNumber}`, stepNumber);
    },

    trackFormSubmit: () => {
      trackCustomEvent('form_submit', 'forms', formName);
    },

    trackFormError: (errorMessage: string) => {
      trackCustomEvent('form_error', 'forms', `${formName}_error`);
      analytics.trackError(`Form error in ${formName}: ${errorMessage}`, 'form_validation');
    },

    trackFormAbandonment: (lastStep: number) => {
      trackCustomEvent('form_abandon', 'forms', formName, lastStep);
    },
  };
};

// Hook for tracking button clicks
export const useButtonTracking = () => {
  const { trackCustomEvent } = useAnalytics();

  return {
    trackButtonClick: (buttonName: string, location: string) => {
      trackCustomEvent('button_click', 'engagement', `${buttonName}_${location}`);
    },

    trackCTAClick: (ctaName: string, location: string) => {
      trackCustomEvent('cta_click', 'engagement', `${ctaName}_${location}`);
    },

    trackLinkClick: (linkText: string, destination: string) => {
      trackCustomEvent('link_click', 'engagement', `${linkText}_to_${destination}`);
    },
  };
};
