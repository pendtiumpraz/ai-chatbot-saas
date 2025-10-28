/**
 * Example: API Routes with Authentication
 * 
 * This file demonstrates how to use authentication in Next.js API Routes.
 */

import { getSession, getCurrentUser, requireRole } from "@/lib/auth-helpers"
import { NextRequest, NextResponse } from "next/server"

// Example 1: Basic authentication check
export async function GET(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    message: "Authenticated",
    user: session.user,
  })
}

// Example 2: Role-based API access
export async function SuperAdminOnlyAPI() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - Super Admin access required" },
      { status: 403 }
    )
  }
  
  // Process super admin request
  return NextResponse.json({
    message: "Super Admin API access granted",
  })
}

// Example 3: Multiple roles allowed
export async function FinanceAPI() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  const allowedRoles = ["SUPER_ADMIN", "FINANCE"]
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Finance access required" },
      { status: 403 }
    )
  }
  
  // Process finance request
  return NextResponse.json({
    message: "Finance API access granted",
  })
}

// Example 4: User-specific data access
export async function UserDataAPI(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  const { searchParams } = new URL(request.url)
  const requestedUserId = searchParams.get("userId")
  
  // Users can only access their own data unless they're SUPER_ADMIN
  if (
    session.user.role !== "SUPER_ADMIN" &&
    session.user.id !== requestedUserId
  ) {
    return NextResponse.json(
      { error: "Forbidden - Cannot access other user's data" },
      { status: 403 }
    )
  }
  
  // Fetch and return user data
  return NextResponse.json({
    userId: requestedUserId,
    message: "User data access granted",
  })
}

// Example 5: POST request with authentication
export async function CreateCourseAPI(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  // Only TEACHER and SUPER_ADMIN can create courses
  const allowedRoles = ["SUPER_ADMIN", "TEACHER"]
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: "Forbidden - Teacher access required" },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    
    // Validate and create course
    // const course = await prisma.course.create({
    //   data: {
    //     ...body,
    //     creatorId: session.user.id,
    //   },
    // })
    
    return NextResponse.json({
      message: "Course created successfully",
      // course,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}

// Example 6: DELETE with ownership check
export async function DeleteCourseAPI(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  // Fetch course to check ownership
  // const course = await prisma.course.findUnique({
  //   where: { id: params.courseId },
  // })
  
  // if (!course) {
  //   return NextResponse.json(
  //     { error: "Course not found" },
  //     { status: 404 }
  //   )
  // }
  
  // Only course creator or SUPER_ADMIN can delete
  // if (
  //   session.user.role !== "SUPER_ADMIN" &&
  //   course.creatorId !== session.user.id
  // ) {
  //   return NextResponse.json(
  //     { error: "Forbidden - Cannot delete this course" },
  //     { status: 403 }
  //   )
  // }
  
  // Delete course
  return NextResponse.json({
    message: "Course deleted successfully",
  })
}

// Example 7: Using helper functions for cleaner code
export async function CleanerAPIExample() {
  try {
    // This will throw an error if not authenticated or not authorized
    await requireRole(["SUPER_ADMIN", "FINANCE"])
    
    // If we reach here, user is authenticated and authorized
    return NextResponse.json({
      message: "Access granted",
    })
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 }
    )
  }
}

// Example 8: Streaming response with authentication
export async function StreamingAPI() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("data: Starting...\n\n"))
      
      // Simulate streaming data
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        controller.enqueue(encoder.encode(`data: Message ${i}\n\n`))
      }
      
      controller.enqueue(encoder.encode("data: Done\n\n"))
      controller.close()
    },
  })
  
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
