# LMS Community - UI/UX Component Library

A comprehensive, responsive, and animated component library for the LMS (Learning Management System) Community project built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.

## Table of Contents

- [Installation](#installation)
- [Component Categories](#component-categories)
- [Getting Started](#getting-started)
- [Components Documentation](#components-documentation)
  - [Public Pages Components](#public-pages-components)
  - [Dashboard Components](#dashboard-components)
  - [CRUD Components](#crud-components)
  - [Shared Components](#shared-components)
- [Examples](#examples)
- [Customization](#customization)
- [Best Practices](#best-practices)

## Installation

### Prerequisites

```bash
npm install
# or
yarn install
```

### Required Dependencies

The following dependencies are already included in `package.json`:

- `next` - React framework
- `react` & `react-dom` - React library
- `framer-motion` - Animation library
- `react-icons` - Icon library
- `react-hot-toast` - Toast notifications
- `tailwindcss` - Utility-first CSS framework
- `clsx` - Utility for constructing className strings
- `typescript` - Type safety

## Component Categories

### 1. Public Pages Components (`src/components/public/`)
Components for public-facing pages (landing page, marketing pages, etc.):
- FloatingNavbar
- HamburgerMenu
- Hero
- Features
- Footer

### 2. Dashboard Components (`src/components/dashboard/`)
Components for authenticated user dashboards:
- DashboardLayout
- DashboardSidebar
- TopNavigation
- Breadcrumbs

### 3. CRUD Components (`src/components/crud/`)
Single-page CRUD interface components:
- CRUDLayout
- CRUDSidebar
- CRUDTable
- CRUDForm

### 4. Shared Components (`src/components/shared/`)
Reusable UI components used across the application:
- Button
- Input
- Card
- Modal & Drawer
- Toast
- Loading & Skeletons

## Getting Started

### Basic Setup

1. **Import the global styles** in your `app/layout.tsx`:

```tsx
import '@/styles/globals.css';
import { Toaster } from '@/components/shared';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

2. **Use components in your pages**:

```tsx
import { FloatingNavbar, Hero, Features, Footer } from '@/components/public';

export default function Home() {
  return (
    <div>
      <FloatingNavbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
```

## Components Documentation

### Public Pages Components

#### FloatingNavbar

A responsive navigation bar that transitions from transparent to solid on scroll.

**Props:**
- `links?: NavLink[]` - Navigation links
- `logo?: React.ReactNode` - Custom logo component
- `showAuth?: boolean` - Show authentication buttons (default: true)
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<FloatingNavbar
  links={[
    { label: 'Home', href: '/' },
    { label: 'Courses', href: '/courses' },
    { label: 'About', href: '/about' },
  ]}
  showAuth={true}
/>
```

#### HamburgerMenu

Animated mobile menu with slide-in animation.

**Props:**
- `isOpen: boolean` - Menu open state
- `onClose: () => void` - Close handler
- `links: NavLink[]` - Navigation links
- `showAuth?: boolean` - Show auth buttons

#### Hero

Animated hero section with gradient background and floating elements.

**Props:**
- `title?: string` - Main heading
- `subtitle?: string` - Subtitle text
- `description?: string` - Description text
- `primaryCTA?: { label, href, onClick }` - Primary call-to-action
- `secondaryCTA?: { label, href, onClick }` - Secondary call-to-action
- `image?: string` - Hero image URL

**Example:**
```tsx
<Hero
  title="Welcome to LMS Community"
  subtitle="Learn. Grow. Succeed."
  description="Transform your learning journey..."
  primaryCTA={{ label: 'Get Started', href: '/register' }}
  secondaryCTA={{ label: 'Watch Demo', href: '#demo' }}
/>
```

#### Features

Grid layout for displaying features with icons and descriptions.

**Props:**
- `title?: string` - Section title
- `subtitle?: string` - Section subtitle
- `features?: Feature[]` - Array of features
- `className?: string` - Additional CSS classes

**Feature Type:**
```typescript
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

#### Footer

Comprehensive footer with multiple sections, social links, and contact info.

**Props:**
- `sections?: FooterSection[]` - Link sections
- `socialLinks?: SocialLink[]` - Social media links
- `contactInfo?: { email, phone, address }` - Contact information

### Dashboard Components

#### DashboardLayout

Main layout wrapper for dashboard pages with sidebar and top navigation.

**Props:**
- `user: User` - Current user object
- `breadcrumbs?: BreadcrumbItem[]` - Breadcrumb navigation
- `children: ReactNode` - Page content
- `onSearch?: (query: string) => void` - Search handler
- `onLogout?: () => void` - Logout handler

**Example:**
```tsx
<DashboardLayout
  user={currentUser}
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Courses' }
  ]}
  onSearch={handleSearch}
  onLogout={handleLogout}
>
  {/* Your dashboard content */}
</DashboardLayout>
```

#### DashboardSidebar

Role-based sidebar navigation with collapsible menu items.

**Props:**
- `role: UserRole` - User role ('student', 'teacher', 'admin')
- `isCollapsed?: boolean` - Collapsed state
- `onToggle?: (collapsed: boolean) => void` - Toggle handler

**Features:**
- Automatic menu items based on user role
- Expandable/collapsible menu groups
- Badge support for notifications
- Smooth animations

#### TopNavigation

Top navigation bar with search, notifications, and user menu.

**Props:**
- `user: User` - Current user
- `onSearch?: (query: string) => void` - Search handler
- `onLogout?: () => void` - Logout handler

**Features:**
- Global search bar
- Notification dropdown with unread count
- User profile menu
- Responsive design

#### Breadcrumbs

Breadcrumb navigation for page hierarchy.

**Props:**
- `items: BreadcrumbItem[]` - Breadcrumb items
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Courses', href: '/dashboard/courses' },
    { label: 'Mathematics 101' }
  ]}
/>
```

### CRUD Components

#### CRUDLayout

Complete CRUD interface with sidebar actions and data table.

**Props:**
- `title: string` - Page title
- `description?: string` - Page description
- `columns: TableColumn[]` - Table column definitions
- `data: TableData[]` - Table data
- `formFields: FormField[]` - Form field definitions
- `onCreateItem: (data) => void | Promise<void>` - Create handler
- `onUpdateItem: (id, data) => void | Promise<void>` - Update handler
- `onDeleteItems: (ids) => void | Promise<void>` - Delete handler
- `onRefresh?: () => void` - Refresh handler
- `isLoading?: boolean` - Loading state
- `useDrawer?: boolean` - Use drawer instead of modal
- `customActions?: Action[]` - Additional custom actions

**Example:**
```tsx
<CRUDLayout
  title="Users"
  description="Manage system users"
  columns={columns}
  data={users}
  formFields={formFields}
  onCreateItem={handleCreate}
  onUpdateItem={handleUpdate}
  onDeleteItems={handleDelete}
  onRefresh={handleRefresh}
  isLoading={isLoading}
/>
```

#### CRUDSidebar

Action sidebar for CRUD operations.

**Props:**
- `actions?: CRUDAction[]` - Custom actions
- `selectedCount?: number` - Number of selected items
- `onRefresh?: () => void` - Refresh handler
- `showDefaultActions?: boolean` - Show default CRUD actions

#### CRUDTable

Data table with sorting, filtering, and selection.

**Props:**
- `columns: TableColumn[]` - Column definitions
- `data: TableData[]` - Table data
- `selectable?: boolean` - Enable row selection
- `onSelect?: (ids) => void` - Selection handler
- `onRowClick?: (row) => void` - Row click handler
- `isLoading?: boolean` - Loading state
- `emptyMessage?: string` - Empty state message

**Features:**
- Column sorting
- Search/filter functionality
- Multi-select with checkboxes
- Custom cell renderers
- Responsive design

#### CRUDForm

Dynamic form generator with validation.

**Props:**
- `fields: FormField[]` - Form field definitions
- `initialData?: Record<string, any>` - Initial form data
- `onSubmit: (data) => void | Promise<void>` - Submit handler
- `onCancel?: () => void` - Cancel handler
- `submitLabel?: string` - Submit button label
- `isLoading?: boolean` - Loading state

**Supported Field Types:**
- text, email, password, number
- textarea
- select (dropdown)
- checkbox
- date
- file

**Example:**
```tsx
const formFields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    validation: { min: 3, max: 50 }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'student', label: 'Student' },
      { value: 'teacher', label: 'Teacher' }
    ]
  }
];
```

### Shared Components

#### Button

Versatile button component with multiple variants and states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'`
- `size?: 'sm' | 'md' | 'lg' | 'xl'`
- `isLoading?: boolean` - Show loading spinner
- `leftIcon?: React.ReactNode` - Left icon
- `rightIcon?: React.ReactNode` - Right icon
- `fullWidth?: boolean` - Full width button
- `animated?: boolean` - Enable hover/tap animations

**Example:**
```tsx
<Button
  variant="primary"
  size="lg"
  leftIcon={<FiSave />}
  onClick={handleSave}
  isLoading={isSubmitting}
>
  Save Changes
</Button>
```

#### Input

Form input with label, error handling, and icons.

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `leftIcon?: React.ReactNode` - Left icon
- `rightIcon?: React.ReactNode` - Right icon
- `fullWidth?: boolean` - Full width input

**Features:**
- Password visibility toggle
- Error state animations
- Icon support
- Validation feedback

**Example:**
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  leftIcon={<FiMail />}
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

#### Card

Card container with header, content, and footer sections.

**Props:**
- `hover?: boolean` - Enable hover effect
- `animated?: boolean` - Enable entrance animation
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Padding size
- `shadow?: 'none' | 'sm' | 'md' | 'lg'` - Shadow size

**Subcomponents:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Example:**
```tsx
<Card hover shadow="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Your content */}
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Modal & Drawer

Modal dialog and side drawer components.

**Modal Props:**
- `isOpen: boolean` - Open state
- `onClose: () => void` - Close handler
- `title?: string` - Modal title
- `children: ReactNode` - Modal content
- `footer?: ReactNode` - Footer content
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size
- `closeOnOverlayClick?: boolean` - Close on backdrop click
- `showCloseButton?: boolean` - Show close button

**Drawer Props:**
- Same as Modal, plus:
- `position?: 'left' | 'right'` - Drawer position
- `width?: string` - Drawer width

**Example:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmation"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

#### Toast

Toast notification system.

**Methods:**
- `toast.success(message, duration?)`
- `toast.error(message, duration?)`
- `toast.warning(message, duration?)`
- `toast.info(message, duration?)`
- `toast.promise(promise, { loading, success, error })`

**Setup:**
```tsx
// In your layout
import { Toaster } from '@/components/shared';

<Toaster />
```

**Usage:**
```tsx
import { toast } from '@/components/shared';

toast.success('Operation completed!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('New update available');
```

#### Loading

Loading indicators and skeleton screens.

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Loading size
- `variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton'` - Loading type
- `fullScreen?: boolean` - Cover full screen
- `text?: string` - Loading text

**Additional Components:**
- `SkeletonCard` - Card skeleton
- `SkeletonTable` - Table skeleton

**Example:**
```tsx
{isLoading ? (
  <Loading variant="spinner" size="lg" text="Loading data..." />
) : (
  <YourContent />
)}
```

## Examples

Complete working examples are available in `src/examples/`:

1. **PublicPageExample.tsx** - Landing page with all public components
2. **DashboardExample.tsx** - Dashboard layout with stats and activity
3. **CRUDExample.tsx** - Complete CRUD interface for user management
4. **SharedComponentsExample.tsx** - Showcase of all shared components

To run examples:
```bash
npm run dev
```

Then navigate to the example pages in your browser.

## Customization

### Colors

Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Your primary colors */ },
      secondary: { /* Your secondary colors */ },
      // ... more colors
    }
  }
}
```

### Animations

Add custom animations in `tailwind.config.js`:

```javascript
animation: {
  'custom-animation': 'customKeyframe 1s ease-in-out',
},
keyframes: {
  customKeyframe: {
    '0%': { /* start state */ },
    '100%': { /* end state */ },
  },
}
```

### Component Styling

All components accept a `className` prop for additional styling:

```tsx
<Button className="my-4 mx-auto">
  Custom Styled Button
</Button>
```

## Best Practices

### 1. Component Organization
- Keep components small and focused
- Use composition over complex props
- Extract reusable logic into hooks

### 2. Performance
- Use `React.memo()` for expensive components
- Lazy load heavy components
- Optimize images and assets

### 3. Accessibility
- All components include ARIA labels
- Keyboard navigation is supported
- Color contrast meets WCAG standards

### 4. Responsive Design
- Mobile-first approach
- Test on multiple screen sizes
- Use Tailwind's responsive utilities

### 5. Type Safety
- Always use TypeScript types
- Define clear prop interfaces
- Leverage type inference

## Contributing

When adding new components:

1. Follow the existing file structure
2. Add TypeScript types in `src/types/`
3. Create examples in `src/examples/`
4. Update this documentation
5. Test across different screen sizes
6. Ensure accessibility standards

## License

This component library is part of the LMS Community project.

---

For more information or support, please refer to the main project documentation.
