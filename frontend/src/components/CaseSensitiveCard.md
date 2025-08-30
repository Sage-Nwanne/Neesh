# Case Sensitive Brand Card Component

## Overview
An animated brand card component for promoting the Case Sensitive conference. Features scroll-based triggering, frequency capping, and accessibility support.

## Features
- ✅ **Scroll-based trigger** - Shows when user scrolls 40% down the page
- ✅ **Frequency capping** - Uses localStorage to avoid nagging users (default: 7 days)
- ✅ **Accessibility** - Proper ARIA roles, Escape key to dismiss, focus management
- ✅ **Mobile-friendly** - Responsive design with proper spacing
- ✅ **Smooth animations** - Framer Motion with reduced motion support
- ✅ **UTM tracking** - Automatic UTM parameters for analytics

## Usage

### Basic Implementation
```tsx
import CaseSensitiveCard from '@/components/CaseSensitiveCard';

// In your App component
<CaseSensitiveCard />
```

### Advanced Configuration
```tsx
<CaseSensitiveCard 
  delayMs={1200}           // Delay after scroll trigger (ms)
  hideForDays={7}          // Frequency cap (days)
  placement="br"           // Position: br, bl, tr, tl
  triggerOnScroll={true}   // Enable scroll-based trigger
  scrollThreshold={40}     // Scroll percentage to trigger
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delayMs` | number | 1800 | Delay in milliseconds after trigger condition is met |
| `hideForDays` | number | 7 | Number of days to hide after dismissal |
| `placement` | string | "br" | Position: "br", "bl", "tr", "tl" |
| `triggerOnScroll` | boolean | true | Enable scroll-based triggering |
| `scrollThreshold` | number | 40 | Percentage of page scroll to trigger |

## Behavior Options

### 1. Scroll-based Trigger (Current)
- Triggers when user scrolls 40% down the page
- Good for capturing engaged users
- Delay of 1200ms after scroll threshold

### 2. Time-based Trigger
```tsx
<CaseSensitiveCard 
  triggerOnScroll={false}
  delayMs={3000}
/>
```

### 3. Session-only Frequency
```tsx
<CaseSensitiveCard 
  hideForDays={0}  // Will use sessionStorage instead
/>
```

## Customization

### Colors
The component uses Neesh's brand colors:
- Background: `#f8f6f3` (surface)
- Text: `#000000` (ink)
- Muted: `#666666` (subtext)
- Accent: `#E86945` (Case Sensitive orange)
- Track: `#34354F` (header stripe)

### Copy Variations
Current copy can be easily modified in the component:
```tsx
// Current
"A new conference shaping the future of print magazines. Panels, workshops, demos, and more."

// Alternative
"Neesh × Case Sensitive: panels, workshops, printers, distributors & retailers—get tickets."
```

## Analytics & Tracking

### UTM Parameters
All links automatically include:
```
?utm_source=neesh&utm_medium=banner&utm_campaign=casesensitive_2025
```

### Frequency Tracking
Uses localStorage key: `cs_card_hidden_until`

## Accessibility

- **Role**: `dialog` for screen readers
- **Escape key**: Dismisses the card
- **Focus management**: Proper tab order
- **Reduced motion**: Respects user preferences
- **ARIA labels**: Proper labeling for assistive technology

## QA Checklist

- [ ] Links work and include UTM parameters
- [ ] Mobile responsive (doesn't overlap navigation)
- [ ] Frequency capping works (test dismiss → reload)
- [ ] Escape key dismisses card
- [ ] Scroll trigger works at 40% page scroll
- [ ] Animation respects reduced motion preferences
- [ ] Card doesn't show if dismissed within frequency period

## Performance

- **Animation duration**: 260ms with gentle easing
- **Bundle impact**: Uses existing Framer Motion dependency
- **Memory**: Cleans up event listeners on unmount
- **Storage**: Minimal localStorage usage

## Deployment Notes

1. **Direct Stripe URL**: Replace `TICKETS_URL` with direct checkout link if provided
2. **Frequency tuning**: Reduce to 3 days during heavy promo periods
3. **A/B testing**: Easy to swap copy or trigger conditions
4. **Localization**: All strings centralized for easy translation
