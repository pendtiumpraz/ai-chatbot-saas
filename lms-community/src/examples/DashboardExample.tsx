'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/shared';
import { User } from '@/types';

/**
 * Example: Dashboard Page
 *
 * This example demonstrates how to use the dashboard layout
 * with sidebar, top navigation, and breadcrumbs.
 */

const DashboardExample = () => {
  // Mock user data
  const user: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student', // Can be 'student', 'teacher', or 'admin'
    avatar: '', // Optional: URL to user avatar
  };

  // Breadcrumb navigation
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Courses', href: '/dashboard/courses' },
    { label: 'Mathematics 101' }, // Current page (no href)
  ];

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Implement logout functionality
  };

  return (
    <DashboardLayout
      user={user}
      breadcrumbs={breadcrumbs}
      onSearch={handleSearch}
      onLogout={handleLogout}
    >
      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your courses today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
              <CardDescription>Active enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary-600">12</div>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Finished courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success-600">8</div>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
              <CardDescription>Currently learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning-600">4</div>
            </CardContent>
          </Card>

          <Card hover>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>Earned achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-600">6</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  course: 'Mathematics 101',
                  activity: 'Completed Quiz 3',
                  time: '2 hours ago',
                },
                {
                  course: 'Physics Fundamentals',
                  activity: 'Watched Lecture 5',
                  time: '5 hours ago',
                },
                {
                  course: 'Chemistry Basics',
                  activity: 'Submitted Assignment 2',
                  time: '1 day ago',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.course}</p>
                    <p className="text-sm text-gray-600">{item.activity}</p>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardExample;
