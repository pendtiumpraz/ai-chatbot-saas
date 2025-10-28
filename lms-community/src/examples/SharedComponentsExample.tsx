'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Drawer,
  toast,
  Loading,
  SkeletonCard,
} from '@/components/shared';
import { FiSave, FiTrash, FiSettings, FiMail } from 'react-icons/fi';

/**
 * Example: Shared Components Showcase
 *
 * This example demonstrates all the shared/common components
 * and their various props and configurations.
 */

const SharedComponentsExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Form submitted successfully!');
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shared Components Showcase
          </h1>
          <p className="text-gray-600">
            Explore all available shared components and their variations
          </p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-lg font-semibold mb-3">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<FiSave />}>Save</Button>
                <Button rightIcon={<FiTrash />} variant="danger">Delete</Button>
                <Button leftIcon={<FiSettings />} variant="ghost">Settings</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-lg font-semibold mb-3">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button isLoading>Loading...</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              leftIcon={<FiMail />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Must be at least 8 characters"
            />
            <Input
              label="With Error"
              type="text"
              error="This field is required"
            />
            <Input
              label="Disabled"
              type="text"
              value="Disabled input"
              disabled
            />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>A basic card with hover effect</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This is the card content. You can put any content here.
                </p>
              </CardContent>
            </Card>

            <Card shadow="lg">
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Includes action buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Cards can have footers with action buttons.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="primary">Action</Button>
              </CardFooter>
            </Card>

            <SkeletonCard />
          </div>
        </section>

        {/* Modals and Drawers */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Modals & Drawers
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button onClick={() => setIsDrawerOpen(true)} variant="secondary">
              Open Drawer
            </Button>
          </div>
        </section>

        {/* Loading States */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Loading States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Spinner</h3>
              <Loading variant="spinner" size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Dots</h3>
              <Loading variant="dots" size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Pulse</h3>
              <Loading variant="pulse" size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">With Text</h3>
              <Loading variant="spinner" size="md" text="Loading..." />
            </div>
          </div>
        </section>

        {/* Toast Notifications */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Toast Notifications
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success('Success message!')}>
              Success Toast
            </Button>
            <Button
              onClick={() => toast.error('Error occurred!')}
              variant="danger"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => toast.warning('Warning message!')}
              variant="warning"
            >
              Warning Toast
            </Button>
            <Button
              onClick={() => toast.info('Information message!')}
              variant="secondary"
            >
              Info Toast
            </Button>
          </div>
        </section>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example modal. You can put any content here.
          </p>
          <Input
            label="Example Input"
            placeholder="Type something..."
            fullWidth
          />
        </div>
      </Modal>

      {/* Drawer Example */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Example Drawer"
        position="right"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDrawerOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example drawer sliding from the right.
          </p>
          <Input label="Name" placeholder="Enter name" fullWidth />
          <Input label="Email" type="email" placeholder="Enter email" fullWidth />
        </div>
      </Drawer>
    </div>
  );
};

export default SharedComponentsExample;
