# Dobeon - Healthcare & IT Consulting Website

A modern, high-performance static website built with Next.js 15, TypeScript, and Tailwind CSS for Dobeon's company profile.

## Overview

Dobeon is a healthcare and IT consulting firm focused on transforming companies into "companies of the future" through expert guidance in digital transformation, healthcare innovation, and enterprise technology.

## Tech Stack

- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom brand colors
- **Font**: Geist Sans & Geist Mono
- **Build Tool**: Turbopack

## Features

- **Responsive Design**: Mobile-first approach with optimized layouts for all devices
- **SEO Optimized**: Complete metadata, structured data (JSON-LD), sitemap, and robots.txt
- **Performance**: Code splitting, image optimization, and compression enabled
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation
- **Modern UI**: Gradient backgrounds, smooth animations, and professional design
- **Page Speed**: Optimized for Core Web Vitals

## Pages

1. **Home** (`/`) - Hero section, services overview, value proposition, social proof
2. **About Us** (`/about`) - Team profiles, mission, values, and experience highlights
3. **Services** (`/services`) - Three-step transformation framework, specializations, industries served
4. **Contact** (`/contact`) - Contact form, location info, and social media links

## Brand Guidelines

### Colors
- **Primary Blue**: `#0066ff`
- **Primary Dark**: `#0052cc`
- **Primary Light**: `#3385ff`
- **White**: `#ffffff`

### Design Principles
- Professional and clean (inspired by avanade.com)
- Modern gradients with brand blue
- Smooth, subtle animations
- Clear typography hierarchy

## Project Structure

```
dobeon-static/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── manifest.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Section.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   └── StructuredData.tsx
├── lib/
│   └── structured-data.ts
├── public/
│   └── robots.txt
└── next.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Performance Optimizations

- **Image Optimization**: Automatic AVIF/WebP format conversion
- **Code Splitting**: Automatic route-based splitting
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Optimized caching headers
- **Standalone Output**: Optimized production bundle

## SEO Features

- Comprehensive metadata for all pages
- Open Graph and Twitter Card support
- Structured data (JSON-LD) for organization, services, and team
- XML sitemap generation
- robots.txt configuration
- PWA manifest

## Deployment

The site can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker** (standalone mode)
- Any static hosting service

### Deploy on Vercel

```bash
npx vercel
```

## Content Management

Currently uses hardcoded content. To integrate a CMS:
1. Add environment variables for CMS API
2. Create data fetching utilities in `lib/`
3. Update page components to fetch dynamic content
4. Configure ISR or SSG as needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All rights reserved - Dobeon 2025
