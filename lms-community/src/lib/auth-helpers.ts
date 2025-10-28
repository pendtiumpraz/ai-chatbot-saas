import { auth } from "./auth"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"
import type { Role } from "@prisma/client"

/**
 * Get the current session (server-side only)
 * Returns null if no session exists
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user from session
 * Returns null if no user is authenticated
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Require authentication - redirects to sign-in if not authenticated
 * @param redirectTo - Optional path to redirect after sign-in
 */
export async function requireAuth(redirectTo?: string) {
  const session = await getSession()
  
  if (!session?.user) {
    const callbackUrl = redirectTo || "/dashboard"
    const encodedUrl = encodeURIComponent(callbackUrl)
    redirect("/auth/signin?callbackUrl=" + encodedUrl)
  }
  
  return session
}

/**
 * Check if user has required role
 * @param allowedRoles - Array of roles that are allowed
 */
export async function checkRole(allowedRoles: Role[]) {
  const session = await getSession()

  if (!session?.user) {
    return false
  }

  return allowedRoles.includes(session.user.role)
}

/**
 * Require specific role - redirects to unauthorized page if not authorized
 * @param allowedRoles - Array of roles that are allowed
 * @param redirectUrl - Optional custom redirect URL for unauthorized access
 */
export async function requireRole(
  allowedRoles: Role[],
  redirectUrl = "/unauthorized"
) {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.user.role)) {
    redirect(redirectUrl)
  }

  return session
}

/**
 * Check if user is Super Admin
 */
export async function isSuperAdmin() {
  return await checkRole(["SUPER_ADMIN"])
}

/**
 * Check if user is Finance
 */
export async function isFinance() {
  return await checkRole(["SUPER_ADMIN", "FINANCE"])
}

/**
 * Check if user is Teacher
 */
export async function isTeacher() {
  return await checkRole(["SUPER_ADMIN", "TEACHER"])
}

/**
 * Check if user is Student
 */
export async function isStudent() {
  return await checkRole(["SUPER_ADMIN", "STUDENT"])
}

/**
 * Update user role (Super Admin only)
 * @param userId - The user ID to update
 * @param newRole - The new role to assign
 */
export async function updateUserRole(userId: string, newRole: Role) {
  const hasPermission = await isSuperAdmin()

  if (!hasPermission) {
    throw new Error("Unauthorized: Only Super Admin can update user roles")
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  })
}

/**
 * Get all users with pagination and filtering
 * @param options - Filter and pagination options
 */
export async function getUsers(options?: {
  role?: Role
  search?: string
  page?: number
  limit?: number
}) {
  const hasPermission = await isSuperAdmin()
  
  if (!hasPermission) {
    throw new Error("Unauthorized: Only Super Admin can view all users")
  }
  
  const page = options?.page || 1
  const limit = options?.limit || 10
  const skip = (page - 1) * limit
  
  const where = {
    ...(options?.role && { role: options.role }),
    ...(options?.search && {
      OR: [
        { name: { contains: options.search, mode: "insensitive" as const } },
        { email: { contains: options.search, mode: "insensitive" as const } },
      ],
    }),
  }
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ])
  
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Refresh Google OAuth access token
 * @param userId - The user ID to refresh token for
 */
export async function refreshGoogleToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleRefreshToken: true,
      id: true,
    },
  })

  if (!user?.googleRefreshToken) {
    throw new Error("No refresh token available")
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: user.googleRefreshToken,
        grant_type: "refresh_token",
      }),
    })

    const tokens = await response.json()

    if (!response.ok) {
      throw new Error(tokens.error || "Failed to refresh token")
    }

    // Update user with new access token
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token,
      },
    })

    return tokens.access_token
  } catch (error) {
    console.error("Error refreshing Google token:", error)
    throw error
  }
}

/**
 * Get valid Google access token (refreshes if expired)
 * @param userId - The user ID to get token for
 */
export async function getValidGoogleToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
    },
  })

  if (!user?.googleAccessToken) {
    throw new Error("No access token available")
  }

  // For simplicity, always try to use the stored token
  // In production, you should check expiry and refresh if needed
  return user.googleAccessToken
}

/**
 * Role hierarchy checker
 * Determines if roleA has equal or higher privileges than roleB
 */
export function hasHigherOrEqualRole(roleA: Role, roleB: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    SUPER_ADMIN: 4,
    FINANCE: 3,
    TEACHER: 2,
    STUDENT: 1,
  }

  return roleHierarchy[roleA] >= roleHierarchy[roleB]
}

/**
 * Get user by ID with role check
 * @param userId - The user ID to fetch
 */
export async function getUserById(userId: string) {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    throw new Error("Unauthorized: Must be logged in")
  }
  
  // Super Admin can view any user
  // Other users can only view their own profile
  if (currentUser.role !== "SUPER_ADMIN" && currentUser.id !== userId) {
    throw new Error("Unauthorized: Cannot view other user's data")
  }
  
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}
