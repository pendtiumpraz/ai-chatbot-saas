'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { TableColumn, TableData, FormField } from '@/types';
import CRUDSidebar from './CRUDSidebar';
import CRUDTable from './CRUDTable';
import CRUDForm from './CRUDForm';
import Modal, { Drawer } from '../shared/Modal';
import Button from '../shared/Button';
import { toast } from '../shared/Toast';
import { FiAlertCircle } from 'react-icons/fi';

interface CRUDLayoutProps {
  title: string;
  description?: string;
  columns: TableColumn[];
  data: TableData[];
  formFields: FormField[];
  onCreateItem: (data: Record<string, any>) => void | Promise<void>;
  onUpdateItem: (id: string | number, data: Record<string, any>) => void | Promise<void>;
  onDeleteItems: (ids: (string | number)[]) => void | Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
  customActions?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
    onClick: () => void;
  }>;
  useDrawer?: boolean;
  className?: string;
}

type ModalMode = 'create' | 'edit' | 'delete' | null;

const CRUDLayout: React.FC<CRUDLayoutProps> = ({
  title,
  description,
  columns,
  data,
  formFields,
  onCreateItem,
  onUpdateItem,
  onDeleteItems,
  onRefresh,
  isLoading = false,
  customActions = [],
  useDrawer = false,
  className,
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingItem, setEditingItem] = useState<TableData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItems = data.filter((item) => selectedIds.includes(item.id));

  // Action handlers
  const handleCreate = () => {
    setEditingItem(null);
    setModalMode('create');
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      const item = data.find((d) => d.id === selectedIds[0]);
      if (item) {
        setEditingItem(item);
        setModalMode('edit');
      }
    }
  };

  const handleDelete = () => {
    setModalMode('delete');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingItem(null);
  };

  // Form submission handlers
  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        await onCreateItem(formData);
        toast.success('Item created successfully');
      } else if (modalMode === 'edit' && editingItem) {
        await onUpdateItem(editingItem.id, formData);
        toast.success('Item updated successfully');
      }
      handleCloseModal();
      setSelectedIds([]);
      onRefresh?.();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDeleteItems(selectedIds);
      toast.success(`${selectedIds.length} item(s) deleted successfully`);
      handleCloseModal();
      setSelectedIds([]);
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to delete items. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actions = [
    {
      id: 'create',
      label: 'Create New',
      icon: <></>,
      variant: 'primary' as const,
      onClick: handleCreate,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <></>,
      variant: 'secondary' as const,
      onClick: handleEdit,
      disabled: selectedIds.length !== 1,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <></>,
      variant: 'danger' as const,
      onClick: handleDelete,
      disabled: selectedIds.length === 0,
    },
    ...customActions,
  ];

  const FormComponent = (
    <CRUDForm
      fields={formFields}
      initialData={editingItem || {}}
      onSubmit={handleFormSubmit}
      onCancel={handleCloseModal}
      submitLabel={modalMode === 'create' ? 'Create' : 'Update'}
      isLoading={isSubmitting}
    />
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar */}
        <CRUDSidebar
          actions={actions}
          selectedCount={selectedIds.length}
          onRefresh={onRefresh}
          showDefaultActions={false}
        />

        {/* Table */}
        <div className="flex-1 min-w-0">
          <CRUDTable
            columns={columns}
            data={data}
            selectable
            onSelect={setSelectedIds}
            isLoading={isLoading}
            emptyMessage={`No ${title.toLowerCase()} found`}
          />
        </div>
      </div>

      {/* Create/Edit Modal or Drawer */}
      {(modalMode === 'create' || modalMode === 'edit') &&
        (useDrawer ? (
          <Drawer
            isOpen={true}
            onClose={handleCloseModal}
            title={modalMode === 'create' ? `Create ${title}` : `Edit ${title}`}
            width="600px"
          >
            {FormComponent}
          </Drawer>
        ) : (
          <Modal
            isOpen={true}
            onClose={handleCloseModal}
            title={modalMode === 'create' ? `Create ${title}` : `Edit ${title}`}
            size="lg"
          >
            {FormComponent}
          </Modal>
        ))}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalMode === 'delete'}
        onClose={handleCloseModal}
        title="Confirm Deletion"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center">
              <FiAlertCircle className="text-danger-600" size={24} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-700">
              Are you sure you want to delete {selectedIds.length} item
              {selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.
            </p>
            {selectedIds.length <= 3 && (
              <ul className="mt-4 space-y-1">
                {selectedItems.map((item) => (
                  <li key={item.id} className="text-sm text-gray-600">
                    • {item.name || item.title || `ID: ${item.id}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CRUDLayout;
