/**
 * Example: Server Component with Authentication
 * 
 * This file demonstrates how to use authentication in Next.js Server Components.
 * Server Components are the default in Next.js 14+ App Router.
 */

import { requireAuth, requireRole, getCurrentUser } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"

// Example 1: Simple authentication requirement
export async function SimpleDashboard() {
  // Redirects to /auth/signin if not authenticated
  const session = await requireAuth()
  
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  )
}

// Example 2: Role-based access
export async function SuperAdminDashboard() {
  // Only SUPER_ADMIN can access this component
  await requireRole(["SUPER_ADMIN"])
  
  return (
    <div>
      <h1>Super Admin Dashboard</h1>
      <p>Manage all users and system settings</p>
    </div>
  )
}

// Example 3: Multiple roles allowed
export async function FinanceDashboard() {
  // Both SUPER_ADMIN and FINANCE can access
  await requireRole(["SUPER_ADMIN", "FINANCE"])
  
  return (
    <div>
      <h1>Finance Dashboard</h1>
      <p>View and manage payments</p>
    </div>
  )
}

// Example 4: Conditional rendering based on role
export async function ConditionalContent() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/signin")
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only show to SUPER_ADMIN */}
      {user.role === "SUPER_ADMIN" && (
        <section>
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
        </section>
      )}
      
      {/* Show to TEACHER and SUPER_ADMIN */}
      {(user.role === "TEACHER" || user.role === "SUPER_ADMIN") && (
        <section>
          <h2>Course Management</h2>
          <button>Create Course</button>
        </section>
      )}
      
      {/* Show to everyone */}
      <section>
        <h2>Your Profile</h2>
        <p>Name: {user.name}</p>
      </section>
    </div>
  )
}

// Example 5: Custom redirect on unauthorized access
export async function CustomRedirectExample() {
  // Redirect to /dashboard instead of /unauthorized if user lacks permission
  await requireRole(["TEACHER"], "/dashboard")
  
  return (
    <div>
      <h1>Teacher Dashboard</h1>
    </div>
  )
}
