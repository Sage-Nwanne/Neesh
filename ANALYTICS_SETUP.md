# Google Analytics Implementation for NEESH

## Overview

Google Analytics has been implemented across the NEESH application to track user interactions, conversions, and application performance. The implementation includes automatic page tracking, custom event tracking, and comprehensive analytics for the retailer application flow.

## Setup

### 1. Google Analytics Configuration

The Google Analytics tracking code is embedded in `frontend/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B3SXLCTCZ9"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-B3SXLCTCZ9');
</script>
```

### 2. Environment Variables

Configure the tracking ID in your environment files:

```bash
# .env.local
VITE_GA_TRACKING_ID=G-B3SXLCTCZ9
VITE_ENABLE_ANALYTICS=true
```

### 3. Analytics Service

The main analytics service is located at `frontend/src/services/analytics.ts` and provides:

- Automatic development mode detection (disables tracking on localhost)
- Page view tracking
- Custom event tracking
- User property management
- Application-specific tracking methods

## Tracked Events

### Authentication Events
- `sign_up` - User registration (publisher/retailer)
- `login` - User sign in
- `logout` - User sign out

### Application Events
- `application_submit` - Application form submission
- `application_approved` - Admin approves application
- `application_denied` - Admin denies application

### E-commerce Events
- `purchase` - Order creation
- `view_item` - Magazine view

### Engagement Events
- `view_dashboard` - Dashboard access
- `search` - Search queries
- `navigate` - Page navigation

### Form Events
- `form_start` - Form interaction begins
- `form_step` - Form step progression
- `form_submit` - Form submission
- `form_error` - Form validation errors
- `form_abandon` - Form abandonment

## Usage Examples

### Basic Event Tracking

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackCustomEvent } = useAnalytics();

// Track a button click
trackCustomEvent('button_click', 'engagement', 'cta_apply_now');
```

### Form Tracking

```typescript
import { useFormTracking } from '@/hooks/useAnalytics';

const formTracking = useFormTracking('retailer_application');

// Track form start
formTracking.trackFormStart();

// Track form steps
formTracking.trackFormStep(2, 'business_info');

// Track form submission
formTracking.trackFormSubmit();
```

### Page Tracking

```typescript
import { usePageTracking } from '@/hooks/useAnalytics';

// Automatic page tracking (add to App.tsx)
const AnalyticsWrapper = ({ children }) => {
  usePageTracking();
  return <>{children}</>;
};
```

## Implementation Details

### Automatic Page Tracking

Page views are automatically tracked when users navigate between routes. The system tracks:
- Page title
- Page URL
- Navigation flow (from → to)

### Development Mode

Analytics are automatically disabled in development mode (localhost) to prevent test data from affecting production analytics. Console logs show what would be tracked.

### Error Tracking

Errors are automatically tracked with context:
- Error message
- Error category
- Component/page where error occurred

### Performance Tracking

Performance metrics can be tracked:
- Page load times
- API response times
- Component render times

## Key Metrics Dashboard

The following metrics are being tracked for business intelligence:

### Conversion Funnel
1. **Homepage Visits** → Application Form Views
2. **Application Form Starts** → Form Completions
3. **Application Submissions** → Approvals
4. **Account Creation** → Dashboard Usage

### User Engagement
- Dashboard views by user type
- Magazine views and interactions
- Search queries and results
- Order creation and completion

### Application Performance
- Form abandonment rates by step
- Validation error frequency
- Time to complete application
- Approval/denial rates

## Custom Dimensions

The following custom dimensions are tracked:

- **User Type**: publisher, retailer, admin, visitor
- **Application Type**: publisher, retailer
- **Dashboard Type**: publisher, retailer, admin
- **Form Name**: retailer_application, publisher_application
- **Error Category**: form_validation, api_error, general

## Goals and Conversions

### Primary Goals
1. **Retailer Application Completion** - Form submission
2. **Application Approval** - Admin approval action
3. **Account Creation** - Successful user registration
4. **First Dashboard View** - User engagement

### Secondary Goals
1. **Magazine Views** - Content engagement
2. **Order Creation** - E-commerce activity
3. **Search Usage** - Platform utilization

## Privacy and Compliance

- Analytics respect user privacy preferences
- No personally identifiable information (PII) is tracked
- GDPR compliant implementation
- Users can opt-out of tracking

## Monitoring and Alerts

Set up the following alerts in Google Analytics:

1. **Spike in Form Abandonment** - Alert if abandonment rate > 80%
2. **Drop in Applications** - Alert if daily applications < 5
3. **Error Rate Increase** - Alert if error events > 10% of total events
4. **Performance Degradation** - Alert if page load time > 3 seconds

## Testing

To test analytics implementation:

1. **Development Mode**: Check console logs for tracked events
2. **Production Mode**: Use Google Analytics Real-Time reports
3. **Debug Mode**: Enable GA debug mode with `gtag('config', 'GA_TRACKING_ID', { debug_mode: true })`

## Maintenance

- Review and update tracked events quarterly
- Monitor for new user flows that need tracking
- Update custom dimensions as features evolve
- Regular data quality audits
