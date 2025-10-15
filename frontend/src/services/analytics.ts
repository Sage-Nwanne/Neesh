// Google Analytics service for NEESH application
// This service provides a clean interface for tracking events and page views

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_type?: 'publisher' | 'retailer' | 'admin' | 'visitor';
  user_id?: string;
  shop_name?: string;
  business_name?: string;
}

class AnalyticsService {
  private isEnabled: boolean = false;
  private trackingId: string = import.meta.env.VITE_GA_TRACKING_ID || 'G-4NDZTD6XEX';

  constructor() {
    // Check if gtag is available and we're not in development mode
    this.isEnabled = typeof window !== 'undefined' &&
                    typeof window.gtag === 'function' &&
                    !this.isDevelopment();

    if (this.isEnabled) {
      console.log('📊 Google Analytics initialized with ID:', this.trackingId);
    } else {
      console.log('📊 Google Analytics disabled (development mode or gtag not available)');
    }
  }

  private isDevelopment(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev');
  }

  // Track page views
  trackPageView(page_title: string, page_location?: string): void {
    if (!this.isEnabled) {
      console.log('📊 [DEV] Page view:', { page_title, page_location });
      return;
    }

    window.gtag('config', this.trackingId, {
      page_title,
      page_location: page_location || window.location.href,
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) {
      console.log('📊 [DEV] Event:', event);
      return;
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }

  // Set user properties
  setUserProperties(properties: UserProperties): void {
    if (!this.isEnabled) {
      console.log('📊 [DEV] User properties:', properties);
      return;
    }

    window.gtag('config', this.trackingId, {
      custom_map: properties,
    });
  }

  // Application-specific tracking methods

  // Authentication events
  trackSignUp(user_type: 'publisher' | 'retailer'): void {
    this.trackEvent({
      action: 'sign_up',
      category: 'authentication',
      label: user_type,
      custom_parameters: {
        method: 'email',
        user_type,
      },
    });
  }

  trackSignIn(user_type: 'publisher' | 'retailer' | 'admin'): void {
    this.trackEvent({
      action: 'login',
      category: 'authentication',
      label: user_type,
      custom_parameters: {
        method: 'email',
        user_type,
      },
    });
  }

  trackSignOut(): void {
    this.trackEvent({
      action: 'logout',
      category: 'authentication',
    });
  }

  // Application events
  trackApplicationSubmission(application_type: 'publisher' | 'retailer', application_id?: string): void {
    this.trackEvent({
      action: 'application_submit',
      category: 'applications',
      label: application_type,
      custom_parameters: {
        application_type,
        application_id,
      },
    });
  }

  trackApplicationApproval(application_type: 'publisher' | 'retailer', application_id: string): void {
    this.trackEvent({
      action: 'application_approved',
      category: 'applications',
      label: application_type,
      custom_parameters: {
        application_type,
        application_id,
      },
    });
  }

  trackApplicationDenial(application_type: 'publisher' | 'retailer', application_id: string): void {
    this.trackEvent({
      action: 'application_denied',
      category: 'applications',
      label: application_type,
      custom_parameters: {
        application_type,
        application_id,
      },
    });
  }

  // E-commerce events
  trackOrderCreation(order_id: string, magazine_title: string, quantity: number, value: number): void {
    this.trackEvent({
      action: 'purchase',
      category: 'ecommerce',
      label: magazine_title,
      value,
      custom_parameters: {
        transaction_id: order_id,
        items: [{
          item_id: magazine_title.toLowerCase().replace(/\s+/g, '_'),
          item_name: magazine_title,
          category: 'magazine',
          quantity,
          price: value / quantity,
        }],
        currency: 'USD',
        value,
      },
    });
  }

  trackMagazineView(magazine_id: string, magazine_title: string): void {
    this.trackEvent({
      action: 'view_item',
      category: 'engagement',
      label: magazine_title,
      custom_parameters: {
        item_id: magazine_id,
        item_name: magazine_title,
        item_category: 'magazine',
      },
    });
  }

  // Dashboard events
  trackDashboardView(dashboard_type: 'publisher' | 'retailer' | 'admin'): void {
    this.trackEvent({
      action: 'view_dashboard',
      category: 'engagement',
      label: dashboard_type,
      custom_parameters: {
        dashboard_type,
      },
    });
  }

  trackSearchQuery(search_term: string, results_count?: number): void {
    this.trackEvent({
      action: 'search',
      category: 'engagement',
      label: search_term,
      custom_parameters: {
        search_term,
        results_count,
      },
    });
  }

  // Navigation events
  trackNavigation(from_page: string, to_page: string): void {
    this.trackEvent({
      action: 'navigate',
      category: 'navigation',
      label: `${from_page} -> ${to_page}`,
      custom_parameters: {
        from_page,
        to_page,
      },
    });
  }

  // Error tracking
  trackError(error_message: string, error_category: string = 'general'): void {
    this.trackEvent({
      action: 'exception',
      category: 'errors',
      label: error_message,
      custom_parameters: {
        description: error_message,
        fatal: false,
        error_category,
      },
    });
  }

  // Performance tracking
  trackPerformance(metric_name: string, value: number): void {
    this.trackEvent({
      action: 'timing_complete',
      category: 'performance',
      label: metric_name,
      value,
      custom_parameters: {
        name: metric_name,
        value,
      },
    });
  }

  // Conversion tracking
  trackConversion(conversion_type: string, value?: number): void {
    this.trackEvent({
      action: 'conversion',
      category: 'conversions',
      label: conversion_type,
      value,
      custom_parameters: {
        conversion_type,
      },
    });
  }
}

// Create and export a singleton instance
export const analytics = new AnalyticsService();

// Export the class for testing purposes
export { AnalyticsService };
