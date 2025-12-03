# Visual Reference Card

Quick visual guide to all Dobeon illustrations

## Hero Illustrations (600x600px)

### HealthcareTech
```
┌──────────────────────────┐
│    ╔═══╗                 │
│    ║ + ║   Medical Cross  │
│    ╚═══╝   + Tech Circuits│
│  ◯───◯───◯               │
│   Circuit Lines          │
└──────────────────────────┘
```
**Use**: Homepage hero, healthcare sections
**Style**: Medical cross with circuit board elements
**Colors**: Blue gradient (#0066ff, #3385ff, #0052cc)

---

### DataAnalytics
```
┌──────────────────────────┐
│   ┃ ┃  ┃   ┃  Bar Chart  │
│   ┃ ┃  ┃   ┃             │
│   ┗━┻━━┻━━━┻             │
│    ╱╲╱╲  Line Graph      │
│   ◯  Pie Chart           │
└──────────────────────────┘
```
**Use**: Services section, data features
**Style**: Charts, graphs, data visualization
**Colors**: Blue shades with data points

---

### TeamCollaboration
```
┌──────────────────────────┐
│      ◉  Person 1         │
│     ╱ ╲                  │
│   ◉───◉  Connected team  │
│  ╱ ╲ ╱ ╲                 │
│ Collaboration            │
└──────────────────────────┘
```
**Use**: About page, team section
**Style**: People silhouettes with connections
**Colors**: Multiple blue shades per person

---

### Innovation
```
┌──────────────────────────┐
│      ╱─╲   Lightbulb     │
│     │ ⚡│                 │
│      ╲─╱                 │
│   ⚙──⚙  Gears           │
│   Innovation             │
└──────────────────────────┘
```
**Use**: Contact page, innovation features
**Style**: Lightbulb with mechanical gears
**Colors**: Blue with light rays

---

## Service Icons (80x80px)

### AssessIcon
```
  ╔═══╗
  ║ ✓ ║  Checklist
  ║ ✓ ║
  ╚═══╝
   🔍 Magnifying Glass
```
**Step 1**: Assess current state
**Elements**: Magnifying glass + checklist

---

### IdentifyIcon
```
    ┃
  ━━╋━━  Target
    ┃
  ╱───╲  Analysis
```
**Step 2**: Identify opportunities
**Elements**: Target + analysis chart

---

### CloseIcon
```
   ✓  Checkmark
  ↗   Growth Arrow
  ║
  ║ ║ ║  Charts
```
**Step 3**: Close the gap
**Elements**: Checkmark + growth indicator

---

## Team Avatars (200x200px)

Each team member has a unique geometric pattern:

| Member | Initial | Pattern |
|--------|---------|---------|
| Soleh Ayubi | SA | Blue geometric + circle |
| Sai Prasad | SP | Diamond pattern |
| John Brownstein | JB | Rounded square |
| Gajen Sunthara | GS | Star gradient |
| Kerrie Holley | KH | Concentric circles |
| Paul Nielsen | PN | Rounded square variant |
| Seth Berkeley | SB | Pentagon |
| Ivan Sini | IS | Overlapping circles |
| Salman Subakat | SS | Circle design |

---

## Decorative Elements

### GridPattern
```
· · · · · ·
· · · · · ·
· · · · · ·
· · · · · ·
```
**Use**: Background texture
**Style**: Subtle dotted grid

---

### WavePattern
```
╱╲╱╲╱╲╱╲╱╲
 ╲╱╲╱╲╱╲╱╲╱
```
**Use**: Section dividers
**Style**: Gentle wave shapes

---

### AbstractShapes
```
Circles:    Squares:    Mixed:
  ○ ○        ▢  ▢       ○ ▢
○     ○      ▢    ▢    ▢ ○ △
```
**Use**: Background decoration
**Variants**: circles, squares, mixed

---

## Color Reference

All illustrations use only these colors:

```
#0066ff ████ Primary Blue
#3385ff ████ Light Blue
#0052cc ████ Dark Blue
#ffffff ░░░░ White (accents)
```

No other colors are used to maintain brand consistency.

---

## Size Guide

| Component | Default Size | Recommended Range |
|-----------|--------------|-------------------|
| Hero Illustrations | 600x600px | 400-600px |
| Service Icons | 80x80px | 60-120px |
| Team Avatars | 200x200px | 150-250px |
| Decorative Elements | 100% width | Variable |

---

## Import Cheat Sheet

```tsx
// All hero illustrations
import {
  HealthcareTech,
  DataAnalytics,
  TeamCollaboration,
  Innovation
} from '@/components/illustrations';

// All service icons
import {
  AssessIcon,
  IdentifyIcon,
  CloseIcon
} from '@/components/illustrations';

// All decorative elements
import {
  GridPattern,
  WavePattern,
  AbstractShapes
} from '@/components/illustrations';

// Team avatars
import TeamAvatar from '@/components/TeamAvatar';
```

---

## Common Patterns

### Hero + Background
```tsx
<section className="relative">
  <GridPattern className="absolute inset-0 -z-10" />
  <HealthcareTech className="w-full max-w-lg" />
</section>
```

### Service Steps
```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div><AssessIcon size={80} /><h3>Assess</h3></div>
  <div><IdentifyIcon size={80} /><h3>Identify</h3></div>
  <div><CloseIcon size={80} /><h3>Close</h3></div>
</div>
```

### Team Grid
```tsx
<div className="grid grid-cols-3 gap-6">
  {team.map(m => <TeamAvatar name={m.name} size={150} />)}
</div>
```

---

**Quick Links**:
- Full Docs: `/components/illustrations/README.md`
- Quick Guide: `/ILLUSTRATIONS_GUIDE.md`
- Preview: `IllustrationShowcase` component

---

All illustrations are production-ready! 🎨
