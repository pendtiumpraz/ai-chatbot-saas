'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FormField } from '@/types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { FiSave, FiX } from 'react-icons/fi';

interface CRUDFormProps {
  fields: FormField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
}

const CRUDForm: React.FC<CRUDFormProps> = ({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isLoading = false,
  className,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required validation
      if (field.required && (!value || value === '')) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Custom validation
      if (value && field.validation) {
        const { min, max, pattern, message } = field.validation;

        if (min !== undefined && value.length < min) {
          newErrors[field.name] = message || `Minimum length is ${min}`;
        }

        if (max !== undefined && value.length > max) {
          newErrors[field.name] = message || `Maximum length is ${max}`;
        }

        if (pattern && !new RegExp(pattern).test(value)) {
          newErrors[field.name] = message || 'Invalid format';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      error: errors[field.name],
      fullWidth: true,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="w-full">
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <textarea
              {...commonProps}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="form-input min-h-[100px]"
              rows={4}
            />
            {errors[field.name] && (
              <p className="form-error">{errors[field.name]}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="w-full">
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <select
              {...commonProps}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="form-input"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="form-error">{errors[field.name]}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="w-full">
            <label className="form-label">
              {field.label}
              {field.required && <span className="text-danger-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              name={field.name}
              onChange={(e) => handleChange(field.name, e.target.files?.[0])}
              className="form-input"
            />
            {errors[field.name] && (
              <p className="form-error">{errors[field.name]}</p>
            )}
          </div>
        );

      default:
        return (
          <Input
            key={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            {...commonProps}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => renderField(field))}
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            leftIcon={<FiX />}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          leftIcon={<FiSave />}
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CRUDForm;
