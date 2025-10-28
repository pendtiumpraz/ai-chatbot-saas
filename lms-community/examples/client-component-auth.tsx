/**
 * Example: Client Component with Authentication
 * 
 * This file demonstrates how to use authentication in Next.js Client Components.
 * Client Components are marked with "use client" directive.
 */

"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Example 1: Basic authentication check
export function ProfileButton() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return (
      <button onClick={() => signIn("google")}>
        Sign In
      </button>
    )
  }
  
  return (
    <div>
      <p>Signed in as {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  )
}

// Example 2: Protected client component
export function ProtectedClientComponent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return null // Will redirect in useEffect
  }
  
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user.name}</p>
    </div>
  )
}

// Example 3: Role-based rendering
export function RoleBasedMenu() {
  const { data: session } = useSession()
  
  if (!session) return null
  
  const { role } = session.user
  
  return (
    <nav>
      <ul>
        {/* All authenticated users */}
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        
        {/* Only SUPER_ADMIN */}
        {role === "SUPER_ADMIN" && (
          <>
            <li><a href="/dashboard/super-admin">Admin Panel</a></li>
            <li><a href="/dashboard/super-admin/users">Manage Users</a></li>
          </>
        )}
        
        {/* SUPER_ADMIN and FINANCE */}
        {(role === "SUPER_ADMIN" || role === "FINANCE") && (
          <li><a href="/dashboard/finance">Payments</a></li>
        )}
        
        {/* SUPER_ADMIN and TEACHER */}
        {(role === "SUPER_ADMIN" || role === "TEACHER") && (
          <li><a href="/dashboard/teacher">My Courses</a></li>
        )}
        
        {/* All users */}
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  )
}

// Example 4: Custom sign-in with callback URL
export function SignInButton() {
  const handleSignIn = () => {
    signIn("google", {
      callbackUrl: "/dashboard",
    })
  }
  
  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  )
}

// Example 5: Sign out with callback
export function SignOutButton() {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
    })
  }
  
  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  )
}

// Example 6: Access token usage
export function GoogleDriveIntegration() {
  const { data: session } = useSession()
  
  const uploadToGoogleDrive = async (file: File) => {
    if (!session?.user?.accessToken) {
      console.error("No access token available")
      return
    }
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const response = await fetch("/api/google-drive/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: formData,
      })
      
      if (response.ok) {
        console.log("File uploaded successfully")
      }
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }
  
  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) uploadToGoogleDrive(file)
        }}
      />
    </div>
  )
}

// Example 7: Role check with loading state
export function AdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session && session.user.role !== "SUPER_ADMIN") {
      router.push("/unauthorized")
    }
  }, [session, status, router])
  
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }
  
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return null // Will redirect in useEffect
  }
  
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only visible to Super Admins</p>
    </div>
  )
}
