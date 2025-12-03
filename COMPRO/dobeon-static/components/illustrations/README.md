# Dobeon Illustrations

Elegant SVG illustrations and icons for the Dobeon website, designed to enhance visual communication while maintaining brand consistency.

## Color Palette

All illustrations use the Dobeon brand colors:
- **Primary Blue**: `#0066ff`
- **Light Blue**: `#3385ff`
- **Dark Blue**: `#0052cc`
- **White**: Used for highlights and text
- **Gray**: Minimal use for subtle effects

## Hero Illustrations

Large-scale illustrations (600x600px) for hero sections and key page areas.

### HealthcareTech
Medical technology illustration featuring a medical cross integrated with tech circuit elements.

```tsx
import { HealthcareTech } from '@/components/illustrations';

<HealthcareTech className="w-full max-w-lg" />
```

**Use cases**: Homepage hero, healthcare technology sections

### DataAnalytics
Data visualization illustration with bar charts, line graphs, and pie charts.

```tsx
import { DataAnalytics } from '@/components/illustrations';

<DataAnalytics className="w-full max-w-lg" />
```

**Use cases**: Services section, analytics features, data-driven content

### TeamCollaboration
Team working together with connection lines and collaboration symbols.

```tsx
import { TeamCollaboration } from '@/components/illustrations';

<TeamCollaboration className="w-full max-w-lg" />
```

**Use cases**: About page, team section, collaboration features

### Innovation
Lightbulb with gears representing innovation and problem-solving.

```tsx
import { Innovation } from '@/components/illustrations';

<Innovation className="w-full max-w-lg" />
```

**Use cases**: Contact page, innovation section, call-to-action areas

## Service Icons

Outline-style icons (80x80px default) for the three-step service process.

### AssessIcon
Magnifying glass with checklist - represents assessment and evaluation.

```tsx
import { AssessIcon } from '@/components/illustrations';

<AssessIcon size={80} className="mx-auto" />
```

### IdentifyIcon
Target with analysis chart - represents identification and targeting.

```tsx
import { IdentifyIcon } from '@/components/illustrations';

<IdentifyIcon size={80} className="mx-auto" />
```

### CloseIcon
Checkmark with growth arrow - represents completion and results.

```tsx
import { CloseIcon } from '@/components/illustrations';

<CloseIcon size={80} className="mx-auto" />
```

**Props**:
- `size`: number (default: 80) - Icon size in pixels
- `className`: string - Additional CSS classes

## Team Avatars

Professional avatar placeholders for team members (200x200px default).

```tsx
import TeamAvatar from '@/components/TeamAvatar';

<TeamAvatar name="Soleh Ayubi" size={200} />
```

**Available team members**:
1. Soleh Ayubi (SA) - Blue with geometric shapes
2. Sai Prasad (SP) - Light blue with diamond pattern
3. John Brownstein (JB) - Dark blue with rounded square
4. Gajen Sunthara (GS) - Gradient with star pattern
5. Kerrie Holley (KH) - Concentric circles
6. Paul Nielsen (PN) - Rounded square design
7. Seth Berkeley (SB) - Pentagon pattern
8. Ivan Sini (IS) - Overlapping circles
9. Salman Subakat (SS) - Circle with initials

**Props**:
- `name`: string (required) - Team member name
- `size`: number (default: 200) - Avatar size in pixels
- `className`: string - Additional CSS classes

## Decorative Elements

Subtle background patterns and decorative shapes.

### GridPattern
Dotted grid background pattern.

```tsx
import { GridPattern } from '@/components/illustrations';

<div className="relative w-full h-64">
  <GridPattern className="absolute inset-0" />
  {/* Your content */}
</div>
```

### WavePattern
Subtle wave divider for section transitions.

```tsx
import { WavePattern } from '@/components/illustrations';

<WavePattern
  opacity={0.1}
  color="#0066ff"
  className="w-full"
/>
```

**Props**:
- `opacity`: number (default: 0.1) - Pattern opacity
- `color`: string (default: '#0066ff') - Pattern color
- `className`: string - Additional CSS classes

### AbstractShapes
Geometric shapes for background decoration.

```tsx
import { AbstractShapes } from '@/components/illustrations';

<div className="relative">
  <AbstractShapes variant="mixed" className="absolute inset-0 -z-10" />
  {/* Your content */}
</div>
```

**Props**:
- `variant`: 'circles' | 'squares' | 'mixed' (default: 'mixed')
- `className`: string - Additional CSS classes

## Usage Examples

### Hero Section with Illustration

```tsx
import { HealthcareTech } from '@/components/illustrations';

<section className="relative overflow-hidden">
  <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h1>Healthcare Technology Solutions</h1>
      <p>Leading the way in digital health innovation</p>
    </div>
    <HealthcareTech className="w-full" />
  </div>
</section>
```

### Service Cards with Icons

```tsx
import { AssessIcon, IdentifyIcon, CloseIcon } from '@/components/illustrations';

const services = [
  { icon: AssessIcon, title: 'Assess', description: '...' },
  { icon: IdentifyIcon, title: 'Identify', description: '...' },
  { icon: CloseIcon, title: 'Close', description: '...' },
];

{services.map(({ icon: Icon, title, description }) => (
  <div key={title} className="text-center p-6">
    <Icon size={80} className="mx-auto mb-4" />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
))}
```

### Team Section with Avatars

```tsx
import TeamAvatar from '@/components/TeamAvatar';

const team = [
  { name: 'Soleh Ayubi', role: 'Co-Founder & CEO' },
  { name: 'Sai Prasad', role: 'Co-Founder & CTO' },
  // ... more team members
];

{team.map(member => (
  <div key={member.name} className="text-center">
    <TeamAvatar name={member.name} size={150} className="mx-auto mb-4" />
    <h3>{member.name}</h3>
    <p>{member.role}</p>
  </div>
))}
```

### Background with Decorative Elements

```tsx
import { GridPattern, AbstractShapes } from '@/components/illustrations';

<section className="relative py-20">
  <GridPattern className="absolute inset-0 -z-10" />
  <AbstractShapes variant="circles" className="absolute inset-0 -z-10" />
  {/* Your content */}
</section>
```

## Design Principles

1. **Minimal & Professional**: Clean geometric shapes, no clutter
2. **Brand Consistent**: Only blue shades from brand palette
3. **Scalable**: All SVG-based for crisp rendering at any size
4. **Accessible**: High contrast, clear visual hierarchy
5. **Performance**: Lightweight SVG files, no external dependencies

## File Structure

```
components/
├── illustrations/
│   ├── HealthcareTech.tsx
│   ├── DataAnalytics.tsx
│   ├── TeamCollaboration.tsx
│   ├── Innovation.tsx
│   ├── AssessIcon.tsx
│   ├── IdentifyIcon.tsx
│   ├── CloseIcon.tsx
│   ├── GridPattern.tsx
│   ├── WavePattern.tsx
│   ├── AbstractShapes.tsx
│   ├── index.tsx
│   └── README.md
└── TeamAvatar.tsx
```

## Tips for Use

1. **Size appropriately**: Hero illustrations work best at 400-600px wide
2. **Use opacity**: Add opacity classes for subtle background effects
3. **Combine elements**: Layer decorative patterns for depth
4. **Responsive sizing**: Use Tailwind classes like `w-full max-w-lg`
5. **Animation ready**: All SVGs support CSS animations and transitions

## Customization

All illustrations can be customized via:
- **className**: Add Tailwind or custom CSS classes
- **Size props**: Control dimensions programmatically
- **Opacity**: Adjust transparency for layering effects
- **Colors**: Modify stroke/fill colors in source files if needed

---

Created for Dobeon - Professional, elegant, brand-consistent illustrations.
