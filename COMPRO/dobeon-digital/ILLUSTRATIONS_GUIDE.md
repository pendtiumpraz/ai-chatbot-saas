# Dobeon Illustrations - Quick Reference

## Import Examples

```tsx
// Import specific illustrations
import { HealthcareTech, DataAnalytics, TeamCollaboration, Innovation } from '@/components/illustrations';
import { AssessIcon, IdentifyIcon, CloseIcon } from '@/components/illustrations';
import { GridPattern, WavePattern, AbstractShapes } from '@/components/illustrations';
import TeamAvatar from '@/components/TeamAvatar';

// Or import all at once
import * as Illustrations from '@/components/illustrations';
```

## Quick Usage

### 1. Hero Illustrations (600x600px)

```tsx
// Homepage Hero
<HealthcareTech className="w-full max-w-xl mx-auto" />

// Services Section
<DataAnalytics className="w-full max-w-lg" />

// About/Team Section
<TeamCollaboration className="w-full max-w-lg" />

// Contact/Innovation Section
<Innovation className="w-full max-w-lg" />
```

### 2. Service Icons (80x80px)

```tsx
// Assess Step
<AssessIcon size={80} className="mx-auto mb-4" />

// Identify Step
<IdentifyIcon size={80} className="mx-auto mb-4" />

// Close Step
<CloseIcon size={80} className="mx-auto mb-4" />

// Custom size
<AssessIcon size={120} className="mx-auto" />
```

### 3. Team Avatars (200x200px)

```tsx
// Individual avatar
<TeamAvatar name="Soleh Ayubi" size={200} />

// Smaller avatar for cards
<TeamAvatar name="Sai Prasad" size={150} className="rounded-full" />

// Team grid
<div className="grid grid-cols-3 gap-6">
  <TeamAvatar name="Soleh Ayubi" size={150} />
  <TeamAvatar name="Sai Prasad" size={150} />
  <TeamAvatar name="John Brownstein" size={150} />
</div>
```

**Available Team Members:**
- Soleh Ayubi (SA)
- Sai Prasad (SP)
- John Brownstein (JB)
- Gajen Sunthara (GS)
- Kerrie Holley (KH)
- Paul Nielsen (PN)
- Seth Berkeley (SB)
- Ivan Sini (IS)
- Salman Subakat (SS)

### 4. Decorative Elements

```tsx
// Grid background
<div className="relative">
  <GridPattern className="absolute inset-0 -z-10" />
  <div className="relative z-10">{/* Content */}</div>
</div>

// Wave divider
<WavePattern opacity={0.1} color="#0066ff" className="w-full" />

// Abstract shapes background
<div className="relative">
  <AbstractShapes variant="mixed" className="absolute inset-0 -z-10 opacity-50" />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

## Common Patterns

### Hero Section with Illustration

```tsx
<section className="container mx-auto px-6 py-20">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div className="space-y-6">
      <h1 className="text-5xl font-bold">Your Heading</h1>
      <p className="text-xl text-gray-600">Your description</p>
      <Button>Get Started</Button>
    </div>
    <HealthcareTech className="w-full" />
  </div>
</section>
```

### Service Steps

```tsx
const services = [
  {
    icon: AssessIcon,
    title: 'Assess',
    description: 'Evaluate your current state'
  },
  {
    icon: IdentifyIcon,
    title: 'Identify',
    description: 'Find opportunities for improvement'
  },
  {
    icon: CloseIcon,
    title: 'Close',
    description: 'Achieve measurable results'
  }
];

<div className="grid md:grid-cols-3 gap-8">
  {services.map(({ icon: Icon, title, description }) => (
    <div key={title} className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <Icon size={80} className="mx-auto mb-6" />
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  ))}
</div>
```

### Team Grid with Avatars

```tsx
const team = [
  { name: 'Soleh Ayubi', role: 'Co-Founder & CEO', bio: '...' },
  { name: 'Sai Prasad', role: 'Co-Founder & CTO', bio: '...' },
  // ... more team members
];

<div className="grid md:grid-cols-3 gap-8">
  {team.map(member => (
    <div key={member.name} className="text-center">
      <TeamAvatar
        name={member.name}
        size={180}
        className="mx-auto mb-4 rounded-2xl shadow-lg"
      />
      <h3 className="text-xl font-bold">{member.name}</h3>
      <p className="text-primary font-semibold">{member.role}</p>
      <p className="text-gray-600 mt-2">{member.bio}</p>
    </div>
  ))}
</div>
```

### Section with Background Decorations

```tsx
<section className="relative py-20 overflow-hidden">
  {/* Background layers */}
  <GridPattern className="absolute inset-0 -z-10" />
  <AbstractShapes
    variant="circles"
    className="absolute inset-0 -z-10 opacity-30"
  />

  {/* Content */}
  <div className="relative z-10 container mx-auto px-6">
    <h2>Your Section Title</h2>
    {/* Your content */}
  </div>

  {/* Wave divider at bottom */}
  <div className="absolute bottom-0 left-0 right-0">
    <WavePattern opacity={0.15} color="#0066ff" />
  </div>
</section>
```

## Color Variants

All illustrations use the Dobeon color palette:

```tsx
// Primary colors in illustrations
const colors = {
  primary: '#0066ff',    // Main blue
  light: '#3385ff',      // Light blue
  dark: '#0052cc',       // Dark blue
};

// Adjust opacity for subtle effects
<HealthcareTech className="opacity-80" />
<GridPattern className="opacity-50" />
```

## Responsive Sizing

```tsx
// Responsive illustration sizes
<HealthcareTech className="w-full max-w-sm md:max-w-md lg:max-w-lg" />

// Responsive icon sizes
<AssessIcon
  size={typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 80}
/>

// Or use Tailwind responsive classes
<div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
  <AssessIcon size={96} />
</div>
```

## Animation Tips

```tsx
// Fade in on scroll
<HealthcareTech className="animate-fade-in-up" />

// Hover effects
<AssessIcon className="transition-transform hover:scale-110" />

// Rotating gear effect (for Innovation illustration)
<Innovation className="animate-spin-slow" />

// Pulse effect
<CloseIcon className="animate-pulse" />
```

## File Locations

```
/mnt/d/AI/COMPRO/dobeon-static/
├── components/
│   ├── illustrations/
│   │   ├── HealthcareTech.tsx        # Hero: Medical + Tech
│   │   ├── DataAnalytics.tsx         # Hero: Charts + Graphs
│   │   ├── TeamCollaboration.tsx     # Hero: Team working
│   │   ├── Innovation.tsx            # Hero: Lightbulb + Gears
│   │   ├── AssessIcon.tsx            # Service: Magnifying glass + Checklist
│   │   ├── IdentifyIcon.tsx          # Service: Target + Analysis
│   │   ├── CloseIcon.tsx             # Service: Checkmark + Growth
│   │   ├── GridPattern.tsx           # Background: Dotted grid
│   │   ├── WavePattern.tsx           # Divider: Wave shapes
│   │   ├── AbstractShapes.tsx        # Background: Geometric shapes
│   │   ├── index.tsx                 # Export all illustrations
│   │   └── README.md                 # Full documentation
│   └── TeamAvatar.tsx                # Team member avatars
```

## Best Practices

1. **Consistent Sizing**: Use predefined sizes (80px for icons, 150-200px for avatars, 400-600px for heroes)
2. **Background Layers**: Stack decorative elements with proper z-index
3. **Opacity Control**: Keep decorative elements subtle (0.05-0.15 opacity)
4. **Responsive Design**: Always test illustrations at different screen sizes
5. **Performance**: SVGs are lightweight, but avoid rendering too many at once
6. **Accessibility**: Illustrations are decorative; ensure text content is accessible

## Need Help?

- Full documentation: `/components/illustrations/README.md`
- Component source: `/components/illustrations/`
- Examples: See usage patterns above

---

All illustrations are professionally designed, brand-consistent, and production-ready!
