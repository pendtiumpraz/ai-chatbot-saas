# Installation & Setup Guide

Complete guide to install and verify the LMS Community UI component library.

## Prerequisites

- **Node.js**: 18.0 or higher
- **npm** or **yarn**: Latest version
- **Git**: For version control

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages:
- ✅ Next.js 16.0
- ✅ React 19.2
- ✅ TypeScript 5.9
- ✅ Tailwind CSS 4.1
- ✅ Framer Motion 12.0
- ✅ React Icons 5.5
- ✅ React Hot Toast 2.4
- ✅ clsx 2.1

### 2. Verify Installation

Check that all components are properly installed:

```bash
# List all component files
ls -R src/components/

# Should show:
# - public/
# - dashboard/
# - crud/
# - shared/
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm start
# or
yarn start
```

## File Structure Verification

After installation, your project should have this structure:

```
lms-community/
├── src/
│   ├── components/
│   │   ├── public/               ✅ 5 components + index
│   │   ├── dashboard/            ✅ 4 components + index
│   │   ├── crud/                 ✅ 4 components + index
│   │   └── shared/               ✅ 6 components + index
│   │
│   ├── examples/                 ✅ 4 example files
│   │   ├── PublicPageExample.tsx
│   │   ├── DashboardExample.tsx
│   │   ├── CRUDExample.tsx
│   │   └── SharedComponentsExample.tsx
│   │
│   ├── types/                    ✅ Type definitions
│   │   └── index.ts
│   │
│   ├── utils/                    ✅ Utilities
│   │   └── cn.ts
│   │
│   └── styles/                   ✅ Global styles
│       └── globals.css
│
├── tailwind.config.js            ✅ Tailwind config
├── tsconfig.json                 ✅ TypeScript config
├── next.config.js                ✅ Next.js config
├── package.json                  ✅ Dependencies
├── QUICKSTART.md                 ✅ Quick start guide
├── COMPONENTS_README.md          ✅ Full documentation
├── COMPONENTS_SUMMARY.md         ✅ Component overview
└── INSTALLATION.md               ✅ This file
```

## Component Checklist

Verify all components are present:

### Public Components (5)
- [ ] FloatingNavbar.tsx
- [ ] HamburgerMenu.tsx
- [ ] Hero.tsx
- [ ] Features.tsx
- [ ] Footer.tsx

### Dashboard Components (4)
- [ ] DashboardLayout.tsx
- [ ] DashboardSidebar.tsx
- [ ] TopNavigation.tsx
- [ ] Breadcrumbs.tsx

### CRUD Components (4)
- [ ] CRUDLayout.tsx
- [ ] CRUDSidebar.tsx
- [ ] CRUDTable.tsx
- [ ] CRUDForm.tsx

### Shared Components (6)
- [ ] Button.tsx
- [ ] Input.tsx
- [ ] Card.tsx
- [ ] Modal.tsx
- [ ] Toast.tsx
- [ ] Loading.tsx

## Quick Test

Create a test page to verify everything works:

**File**: `app/test/page.tsx`

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/shared';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Component Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardHeader>
            <CardTitle>Test Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="primary">Primary Button</Button>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Test Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="secondary">Secondary Button</Button>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Test Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="success">Success Button</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

Navigate to `http://localhost:3000/test` to see the test page.

## Troubleshooting

### Issue: Module not found errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix any type errors shown
```

### Issue: Tailwind styles not applying

**Solution:**
1. Check `tailwind.config.js` includes content paths
2. Verify `globals.css` imports Tailwind directives
3. Restart dev server

### Issue: Framer Motion animations not working

**Solution:**
```bash
# Reinstall framer-motion
npm uninstall framer-motion
npm install framer-motion@latest
```

### Issue: Icons not displaying

**Solution:**
```bash
# Verify react-icons installation
npm install react-icons@latest
```

## Environment Setup

### 1. Create `.env.local` file (if needed)

```env
# Add any environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Configure ESLint (optional)

The project includes Next.js ESLint config. Run:

```bash
npm run lint
```

### 3. Configure Git (optional)

```bash
git init
git add .
git commit -m "Initial commit with UI components"
```

## Development Workflow

### 1. Making Changes

```bash
# Start dev server
npm run dev

# Edit components in src/components/
# Changes will hot-reload automatically
```

### 2. Testing Components

```bash
# Run TypeScript check
npx tsc --noEmit

# Build project
npm run build
```

### 3. Adding New Components

1. Create component in appropriate directory
2. Add TypeScript types in `src/types/index.ts`
3. Export in directory's `index.ts`
4. Create example in `src/examples/`
5. Update documentation

## Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

## Post-Installation

After successful installation:

1. ✅ Read `QUICKSTART.md` for basic usage
2. ✅ Explore `src/examples/` for code samples
3. ✅ Check `COMPONENTS_README.md` for API docs
4. ✅ Review `COMPONENTS_SUMMARY.md` for overview
5. ✅ Start building your application!

## Verification Commands

Run these to verify your installation:

```bash
# Check Node version (should be 18+)
node -v

# Check npm version
npm -v

# List installed dependencies
npm list --depth=0

# Check TypeScript
npx tsc --version

# Verify Next.js
npx next --version
```

## Expected Output

After running `npm run dev`, you should see:

```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
○ Network:      http://192.168.1.x:3000

✓ Compiled successfully
```

## Getting Help

If you encounter issues:

1. **Check Documentation**:
   - QUICKSTART.md
   - COMPONENTS_README.md
   - INSTALLATION.md (this file)

2. **Verify Installation**:
   ```bash
   npm run build
   ```

3. **Clean Reinstall**:
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

4. **Check System Requirements**:
   - Node.js 18+ ✓
   - Modern browser ✓
   - Sufficient disk space ✓

## Next Steps

✅ **Installation Complete!**

Now you can:

1. Create your first page using the examples
2. Customize theme colors in `tailwind.config.js`
3. Build your LMS application
4. Deploy to production

Happy coding! 🚀

---

**Installation Guide Version**: 1.0.0
**Last Updated**: 2025-10-28
