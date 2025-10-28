# Quick Start Guide - LMS Community UI Components

Get up and running with the LMS Community component library in minutes!

## Installation

1. **Install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

## Project Structure

```
lms-community/
├── src/
│   ├── components/
│   │   ├── public/          # Public page components
│   │   │   ├── FloatingNavbar.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── TopNavigation.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── crud/           # CRUD components
│   │   │   ├── CRUDLayout.tsx
│   │   │   ├── CRUDSidebar.tsx
│   │   │   ├── CRUDTable.tsx
│   │   │   ├── CRUDForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── shared/         # Shared/common components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Loading.tsx
│   │       └── index.ts
│   │
│   ├── examples/           # Example usage
│   │   ├── PublicPageExample.tsx
│   │   ├── DashboardExample.tsx
│   │   ├── CRUDExample.tsx
│   │   └── SharedComponentsExample.tsx
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/              # Utility functions
│   │   └── cn.ts
│   │
│   └── styles/             # Global styles
│       └── globals.css
│
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies
```

## 5-Minute Tutorial

### 1. Create a Public Landing Page

Create a file `app/page.tsx`:

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

### 2. Create a Dashboard Page

Create a file `app/dashboard/page.tsx`:

```tsx
'use client';

import { DashboardLayout } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';

export default function Dashboard() {
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student' as const,
  };

  return (
    <DashboardLayout user={user}>
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">12</div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success-600">8</div>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning-600">4</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

### 3. Create a CRUD Page

Create a file `app/dashboard/users/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { CRUDLayout } from '@/components/crud';
import { DashboardLayout } from '@/components/dashboard';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
  ]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    {
      name: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' },
      ],
    },
  ];

  const currentUser = {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin' as const,
  };

  return (
    <DashboardLayout
      user={currentUser}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]}
    >
      <CRUDLayout
        title="Users"
        columns={columns}
        data={users}
        formFields={formFields}
        onCreateItem={(data) => {
          setUsers([...users, { ...data, id: users.length + 1 }]);
        }}
        onUpdateItem={(id, data) => {
          setUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
        }}
        onDeleteItems={(ids) => {
          setUsers(users.filter((u) => !ids.includes(u.id)));
        }}
      />
    </DashboardLayout>
  );
}
```

### 4. Add Global Styles

Update `app/layout.tsx`:

```tsx
import '@/styles/globals.css';
import { Toaster } from '@/components/shared';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

## Common Patterns

### Using Toast Notifications

```tsx
import { toast } from '@/components/shared';

// Success
toast.success('User created successfully!');

// Error
toast.error('Failed to save changes');

// Warning
toast.warning('Please check your input');

// Info
toast.info('New update available');
```

### Using Modals

```tsx
import { useState } from 'react';
import { Modal, Button } from '@/components/shared';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
          </>
        }
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Loading States

```tsx
import { Loading } from '@/components/shared';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <Loading variant="spinner" size="lg" text="Loading..." />;
  }

  return <div>Your content</div>;
}
```

## Customization

### Changing Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#your-color',
        // ... other shades
      },
    }
  }
}
```

### Adding Custom Components

1. Create your component in `src/components/shared/`
2. Export it in `src/components/shared/index.ts`
3. Use it anywhere in your app

## Next Steps

1. **Explore Examples**: Check out `src/examples/` for complete working examples
2. **Read Documentation**: See `COMPONENTS_README.md` for detailed API documentation
3. **Customize**: Modify colors, animations, and styles to match your brand
4. **Build**: Start creating your own pages using these components!

## Troubleshooting

### Issue: Components not showing styles
**Solution**: Make sure `@/styles/globals.css` is imported in your root layout

### Issue: TypeScript errors
**Solution**: Run `npm run build` to check for type errors

### Issue: Animations not working
**Solution**: Ensure `framer-motion` is installed: `npm install framer-motion`

### Issue: Icons not displaying
**Solution**: Make sure `react-icons` is installed: `npm install react-icons`

## Support

For more detailed documentation, see:
- `COMPONENTS_README.md` - Complete component documentation
- `src/examples/` - Working code examples
- `src/types/index.ts` - TypeScript type definitions

Happy coding! 🚀
