'use client';

import React from 'react';
import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

// Toast wrapper component
export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 5000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '500px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

// Custom toast functions
export const toast = {
  success: (message: string, duration?: number) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'opacity-0'
          } max-w-md w-full bg-white shadow-hard rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-success-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: duration || 3000 }
    );
  },

  error: (message: string, duration?: number) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'opacity-0'
          } max-w-md w-full bg-white shadow-hard rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-6 w-6 text-danger-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: duration || 4000 }
    );
  },

  warning: (message: string, duration?: number) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'opacity-0'
          } max-w-md w-full bg-white shadow-hard rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-6 w-6 text-warning-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: duration || 4000 }
    );
  },

  info: (message: string, duration?: number) => {
    hotToast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'opacity-0'
          } max-w-md w-full bg-white shadow-hard rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiInfo className="h-6 w-6 text-primary-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => hotToast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: duration || 3000 }
    );
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, messages);
  },
};
