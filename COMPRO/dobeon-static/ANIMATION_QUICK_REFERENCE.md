# Animation Quick Reference Guide

## Component Animation Matrix

| Component | Animation Type | Trigger | Duration | Delay Options |
|-----------|---------------|---------|----------|---------------|
| **Button** | Ripple + Scale + Shine | Click/Hover | 300ms | - |
| **Card** | Slide Up + Fade | Scroll into view | 500ms | Configurable |
| **Hero** | Staggered Sequence | Page load | 100-400ms | Auto-stagger |
| **Header** | Shadow + Scale | Scroll/Hover | 300ms | - |
| **Section** | Fade + Slide | Scroll into view | 600ms | Auto-stagger |

## Animation Variants Reference

### Available Variants
```tsx
type AnimationVariant =
  | 'fadeIn'      // Simple fade
  | 'slideUp'     // Slide from bottom
  | 'slideDown'   // Slide from top
  | 'slideLeft'   // Slide from right
  | 'slideRight'  // Slide from left
  | 'scaleIn'     // Scale from 95%
  | 'scaleUp';    // Scale from 90%
```

## Quick Implementation Examples

### 1. Animated Card Grid
```tsx
<div className="grid grid-cols-3 gap-8">
  {items.map((item, index) => (
    <Card
      key={index}
      title={item.title}
      description={item.description}
      animationVariant="slideUp"
      delay={index * 100}  // Stagger by 100ms
    />
  ))}
</div>
```

### 2. Custom Scroll Animation
```tsx
import { useInView, getAnimationClasses } from '@/lib/animations';

function MyComponent() {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={getAnimationClasses('fadeIn', isInView)}
    >
      Content animates when visible
    </div>
  );
}
```

### 3. Counter Animation
```tsx
import { useCountUp, useInView } from '@/lib/animations';

function StatCounter() {
  const { ref, isInView } = useInView();
  const count = useCountUp(1000, 2000, isInView);

  return <div ref={ref}>{count}+</div>;
}
```

### 4. Parallax Effect
```tsx
import { useParallax } from '@/lib/animations';

function ParallaxSection() {
  const { ref, offset } = useParallax(0.5);

  return (
    <div
      ref={ref}
      style={{ transform: `translateY(${offset}px)` }}
    >
      Parallax content
    </div>
  );
}
```

## CSS Animation Classes

### Basic Animations
```html
<!-- Fade effects -->
<div class="animate-fade-in">Fades in</div>

<!-- Slide effects -->
<div class="animate-slide-up">Slides up</div>
<div class="animate-slide-down">Slides down</div>
<div class="animate-slide-left">Slides left</div>
<div class="animate-slide-right">Slides right</div>

<!-- Scale effects -->
<div class="animate-scale-in">Scales in</div>

<!-- Special effects -->
<div class="animate-float">Floats up and down</div>
<div class="animate-pulse">Pulses opacity</div>
<div class="animate-shimmer">Shimmer effect</div>
```

### Stagger Delays
```html
<div class="animate-fade-in stagger-1">First (100ms)</div>
<div class="animate-fade-in stagger-2">Second (200ms)</div>
<div class="animate-fade-in stagger-3">Third (300ms)</div>
```

### Hover Effects
```html
<!-- Lift with shadow -->
<div class="hover-lift">Lifts on hover</div>

<!-- Glow border -->
<button class="hover-glow">Glows on hover</button>

<!-- Scale up -->
<div class="hover-scale">Scales on hover</div>

<!-- Shine sweep -->
<button class="hover-shine">Shines on hover</button>

<!-- Animated underline -->
<a class="underline-animate">Link with underline</a>
```

## Timing Presets

```typescript
import { durations, staggerDelays } from '@/lib/animations';

durations.fast      // 300ms
durations.normal    // 500ms
durations.slow      // 700ms
durations.slower    // 1000ms

staggerDelays.fast   // 50ms
staggerDelays.normal // 100ms
staggerDelays.slow   // 150ms
staggerDelays.slower // 200ms
```

## Common Patterns

### Pattern 1: Staggered Grid Cards
```tsx
{items.map((item, i) => (
  <Card {...item} delay={i * 100} />
))}
```

### Pattern 2: Sequential Text Reveal
```tsx
<h1 className="animate-fade-in stagger-1">Title</h1>
<p className="animate-fade-in stagger-2">Subtitle</p>
<div className="animate-fade-in stagger-3">CTA</div>
```

### Pattern 3: Hover Group
```tsx
<div className="group">
  <div className="group-hover:scale-110">Icon</div>
  <h3 className="group-hover:text-primary">Title</h3>
</div>
```

### Pattern 4: Loading State
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
</div>
```

## Accessibility

### Reduced Motion Support
All animations automatically respect user preferences:

```css
/* Automatically applied */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Manual Override
```tsx
const { ref, isInView } = useInView({
  // Will skip animation if user prefers reduced motion
});
```

## Performance Tips

### ✅ DO
- Use `transform` and `opacity` for animations
- Batch animations in the same frame
- Use CSS animations when possible
- Clean up event listeners and timers
- Use `will-change` sparingly

### ❌ DON'T
- Animate `width`, `height`, `top`, `left`
- Start animations before elements are visible
- Create animation loops without cleanup
- Nest too many animated elements
- Use heavy box-shadows in animations

## Debugging

### Check if animation is running:
```javascript
// In browser DevTools
document.querySelector('.animate-fade-in').getAnimations()
```

### Slow down animations for testing:
```css
/* Add to globals.css temporarily */
* {
  animation-duration: 3s !important;
  transition-duration: 3s !important;
}
```

### Monitor performance:
```javascript
// In browser DevTools console
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Animation:', entry.name, entry.duration);
  }
});
observer.observe({ entryTypes: ['measure'] });
```

## Browser DevTools

### Chrome/Edge
1. Open DevTools (F12)
2. Go to "Animations" tab
3. Trigger animations
4. Adjust playback speed
5. Inspect animation details

### Firefox
1. Open DevTools (F12)
2. Go to "Inspector"
3. Click on animated element
4. View "Animations" panel
5. Control animation playback

## Cheat Sheet

| Need | Use |
|------|-----|
| Scroll animation | `useInView()` hook |
| Stagger effect | `delay` prop or `.stagger-N` |
| Hover lift | `.hover-lift` class |
| Button ripple | Button component (built-in) |
| Number counter | `useCountUp()` hook |
| Parallax | `useParallax()` hook |
| Custom animation | `getAnimationClasses()` |
| Reduce motion | Automatic (system preference) |

## Support

For questions or issues:
1. Check ANIMATIONS.md for detailed docs
2. Review ANIMATION_IMPLEMENTATION_SUMMARY.md
3. Inspect component source code
4. Test in browser DevTools
