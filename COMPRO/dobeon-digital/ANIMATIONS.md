# Animation System Documentation

This document provides a comprehensive overview of the animation system implemented in the dobeon-static project, inspired by professional design patterns from Avanade.com.

## Overview

The animation system is built with performance, accessibility, and user experience in mind. All animations:
- Respect `prefers-reduced-motion` settings
- Run at 60fps for smooth performance
- Use hardware-accelerated CSS properties
- Are optimized for mobile devices
- Follow professional timing and easing standards

## Animation Utilities (`/lib/animations.ts`)

### Hooks

#### `useInView(options?: IntersectionObserverInit)`
Detects when an element enters the viewport for scroll-triggered animations.

```tsx
const { ref, isInView } = useInView();

return (
  <div ref={ref} className={isInView ? 'animate' : 'hidden'}>
    Content
  </div>
);
```

**Features:**
- Only animates once when element enters viewport
- Configurable threshold and rootMargin
- Automatically respects reduced-motion preferences

#### `useInViewContinuous(options?: IntersectionObserverInit)`
Similar to `useInView` but resets when element leaves viewport.

#### `useCountUp(end: number, duration?: number, enabled?: boolean)`
Animates numerical values with smooth easing.

```tsx
const count = useCountUp(1000, 2000, isInView);
return <span>{count}</span>;
```

#### `useParallax(speed?: number)`
Creates parallax scrolling effects.

```tsx
const { ref, offset } = useParallax(0.5);
return (
  <div ref={ref} style={{ transform: `translateY(${offset}px)` }}>
    Parallax content
  </div>
);
```

### Helper Functions

#### `getAnimationClasses(variant, isInView)`
Returns the appropriate CSS classes for animations based on viewport visibility.

**Available variants:**
- `fadeIn` - Simple opacity fade
- `slideUp` - Slide from bottom with fade
- `slideDown` - Slide from top with fade
- `slideLeft` - Slide from right with fade
- `slideRight` - Slide from left with fade
- `scaleIn` - Scale up with fade
- `scaleUp` - Larger scale animation

#### `getStaggerStyle(index, baseDelay)`
Generates inline transition delays for staggered animations.

```tsx
{items.map((item, index) => (
  <div style={getStaggerStyle(index, 100)}>
    {item}
  </div>
))}
```

## Global CSS Animations (`/app/globals.css`)

### Keyframe Animations

#### Core Animations
- `@keyframes fadeIn` - Fade in with slight upward movement
- `@keyframes slideUp` - Slide up from below
- `@keyframes slideDown` - Slide down from above
- `@keyframes slideLeft` - Slide from right to left
- `@keyframes slideRight` - Slide from left to right
- `@keyframes scaleIn` - Scale from 95% to 100%
- `@keyframes scaleUp` - Scale from 90% to 100%

#### Special Effects
- `@keyframes gradientShift` - Animated gradient background
- `@keyframes shimmer` - Shine/shimmer effect
- `@keyframes pulse` - Pulsing opacity
- `@keyframes float` - Floating/hovering effect
- `@keyframes ripple` - Material Design ripple effect
- `@keyframes fadeInUp` - Combined fade and slide up

### Animation Classes

#### Basic Animations
```css
.animate-fade-in       /* 600ms fade in */
.animate-slide-up      /* 600ms slide up */
.animate-slide-down    /* 600ms slide down */
.animate-scale-in      /* 500ms scale in */
.animate-float         /* 3s infinite float */
.animate-pulse         /* 2s infinite pulse */
```

#### Stagger Delays
```css
.stagger-1  /* 100ms delay */
.stagger-2  /* 200ms delay */
.stagger-3  /* 300ms delay */
...
.stagger-8  /* 800ms delay */
```

#### Duration Utilities
```css
.duration-300  /* 300ms transition */
.duration-400  /* 400ms transition */
.duration-500  /* 500ms transition */
.duration-600  /* 600ms transition */
.duration-700  /* 700ms transition */
.duration-800  /* 800ms transition */
```

### Hover Effects

#### `.hover-lift`
Lifts element on hover with enhanced shadow.
```tsx
<div className="hover-lift">Content</div>
```

#### `.hover-glow`
Adds animated gradient border on hover.
```tsx
<button className="hover-glow">Button</button>
```

#### `.hover-scale`
Scales element to 105% on hover.
```tsx
<div className="hover-scale">Content</div>
```

#### `.hover-shine`
Creates a shine effect that sweeps across on hover.
```tsx
<button className="hover-shine">Shiny Button</button>
```

#### `.underline-animate`
Animated underline that grows on hover.
```tsx
<a className="underline-animate">Link</a>
```

## Component Animations

### Button Component
**Features:**
- Ripple effect on click
- Scale and shadow on hover
- Shine effect animation
- Smooth color transitions

**Props:**
- `ripple?: boolean` - Enable/disable ripple effect (default: true)

**Example:**
```tsx
<Button variant="primary" ripple={true}>
  Click Me
</Button>
```

### Card Component
**Features:**
- Scroll-triggered entrance animation
- Enhanced hover effects with lift and shadow
- Icon rotation and scale on hover
- Animated gradient border on hover
- Staggered delays for lists

**Props:**
- `animationVariant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn'`
- `delay?: number` - Animation delay in milliseconds

**Example:**
```tsx
{items.map((item, index) => (
  <Card
    title={item.title}
    description={item.description}
    animationVariant="slideUp"
    delay={index * 100}
  />
))}
```

### Hero Component
**Features:**
- Animated gradient background
- Staggered text animation sequence
- Floating decorative elements
- Button glow effects
- Scroll indicator with float animation

**Animation Sequence:**
1. Subtitle slides down (0ms)
2. Title fades in (100ms delay)
3. Description fades in (200ms delay)
4. CTA buttons slide up (300ms delay)
5. Scroll indicator appears (400ms delay)

### Header Component
**Features:**
- Shadow intensifies on scroll
- Logo scales and rotates on hover
- Underline animation on nav links
- Mobile menu slide-in animation
- Backdrop blur overlay
- Staggered mobile menu items
- Smooth scroll state transitions

**Animations:**
- Logo hover: Scale 110% + 6° rotation
- Nav links: Animated underline
- Mobile menu: Slide-in with stagger
- Scroll state: Enhanced shadow

### Section Component
**Features:**
- Scroll-triggered header animations
- Staggered subtitle, title, description
- Smooth entrance for section content

**Animation Sequence:**
1. Subtitle slides down (0ms)
2. Title fades in (100ms delay)
3. Description fades in (200ms delay)

## Best Practices

### Performance
1. Use `transform` and `opacity` for animations (GPU-accelerated)
2. Avoid animating `width`, `height`, `top`, `left` (causes reflow)
3. Use `will-change` sparingly and remove after animation
4. Keep animations under 600ms for most interactions
5. Use `requestAnimationFrame` for JavaScript animations

### Accessibility
1. Always respect `prefers-reduced-motion`
2. Ensure animations don't interfere with content readability
3. Provide alternative indicators for important state changes
4. Don't rely solely on animation to convey information

### Timing Guidelines
- **Micro-interactions:** 100-300ms (buttons, links)
- **Element transitions:** 300-500ms (cards, modals)
- **Page transitions:** 500-800ms (route changes)
- **Ambient animations:** 2-4s (floating, pulsing)

### Easing Functions
- **Ease-out:** Elements entering the screen
- **Ease-in:** Elements leaving the screen
- **Ease-in-out:** Elements moving within the screen

## Mobile Optimization

On mobile devices, animations are:
- Simplified to reduce processing load
- Shortened in duration (typically 70-80% of desktop duration)
- Limited to essential transitions only
- Automatically disabled when battery is low (browser-dependent)

## Browser Support

All animations are compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+

Fallbacks are provided for older browsers through progressive enhancement.

## Debugging

### Check Animation Performance
```javascript
// In browser DevTools console
performance.mark('animation-start');
// Run animation
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
```

### Disable All Animations (Testing)
```css
* {
  animation-duration: 0ms !important;
  transition-duration: 0ms !important;
}
```

## Future Enhancements

Potential additions to the animation system:
- Page transition animations using View Transitions API
- Loading skeleton animations
- Progress bar animations
- Toast/notification animations
- Image gallery transitions
- Chart/data visualization animations
- Scroll-linked animations using scroll-timeline
