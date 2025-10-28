'use client';

import React, { useState } from 'react';
import { CRUDLayout } from '@/components/crud';
import { DashboardLayout } from '@/components/dashboard';
import { TableColumn, FormField, User } from '@/types';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import Button from '@/components/shared/Button';

/**
 * Example: CRUD Page (Users Management)
 *
 * This example demonstrates how to use the CRUD components
 * to create a complete CRUD interface for managing users.
 */

const CRUDExample = () => {
  // Mock user data for the logged-in user
  const currentUser: User = {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  };

  // Mock data for the table
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'teacher',
      status: 'active',
      joinDate: '2024-02-20',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'student',
      status: 'inactive',
      joinDate: '2024-03-10',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
          value === 'admin' ? 'bg-purple-100 text-purple-800' :
          value === 'teacher' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
          value === 'active' ? 'bg-success-100 text-success-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Define form fields
  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true,
      validation: {
        min: 3,
        max: 50,
        message: 'Name must be between 3 and 50 characters',
      },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Please enter a valid email address',
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'admin', label: 'Admin' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      validation: {
        min: 8,
        message: 'Password must be at least 8 characters',
      },
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      placeholder: 'Enter a short bio',
    },
  ];

  // CRUD handlers
  const handleCreateItem = async (data: Record<string, any>) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      joinDate: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setIsLoading(false);
    console.log('Created:', data);
  };

  const handleUpdateItem = async (id: string | number, data: Record<string, any>) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(users.map((user) =>
      user.id === id
        ? { ...user, ...data }
        : user
    ));
    setIsLoading(false);
    console.log('Updated:', id, data);
  };

  const handleDeleteItems = async (ids: (string | number)[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers(users.filter((user) => !ids.includes(user.id)));
    setIsLoading(false);
    console.log('Deleted:', ids);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Refreshed data');
    }, 1000);
  };

  return (
    <DashboardLayout
      user={currentUser}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Users' },
      ]}
    >
      <CRUDLayout
        title="Users"
        description="Manage system users and their permissions"
        columns={columns}
        data={users}
        formFields={formFields}
        onCreateItem={handleCreateItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItems={handleDeleteItems}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        useDrawer={false} // Set to true to use drawer instead of modal
        customActions={[
          {
            id: 'export',
            label: 'Export CSV',
            icon: <></>,
            variant: 'ghost',
            onClick: () => console.log('Export clicked'),
          },
        ]}
      />
    </DashboardLayout>
  );
};

export default CRUDExample;
