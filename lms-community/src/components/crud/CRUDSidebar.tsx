'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Button from '../shared/Button';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiUpload,
} from 'react-icons/fi';

interface CRUDAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  onClick: () => void;
  disabled?: boolean;
}

interface CRUDSidebarProps {
  actions?: CRUDAction[];
  selectedCount?: number;
  onRefresh?: () => void;
  showDefaultActions?: boolean;
  className?: string;
}

const CRUDSidebar: React.FC<CRUDSidebarProps> = ({
  actions,
  selectedCount = 0,
  onRefresh,
  showDefaultActions = true,
  className,
}) => {
  const defaultActions: CRUDAction[] = showDefaultActions
    ? [
        {
          id: 'create',
          label: 'Create New',
          icon: <FiPlus />,
          variant: 'primary',
          onClick: () => console.log('Create clicked'),
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: <FiEdit />,
          variant: 'secondary',
          onClick: () => console.log('Edit clicked'),
          disabled: selectedCount !== 1,
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <FiTrash2 />,
          variant: 'danger',
          onClick: () => console.log('Delete clicked'),
          disabled: selectedCount === 0,
        },
      ]
    : [];

  const allActions = [...defaultActions, ...(actions || [])];

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-gray-200 p-4 flex flex-col space-y-3',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Actions
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
        )}
      </div>

      {/* Selection Info */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-primary-50 border border-primary-200 rounded-lg"
        >
          <p className="text-sm font-medium text-primary-700">
            {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 flex-1">
        {allActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={action.variant || 'ghost'}
              size="sm"
              fullWidth
              leftIcon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              className="justify-start"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Additional Actions Section */}
      <div className="border-t border-gray-200 pt-3 mt-auto space-y-2">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          leftIcon={<FiFilter />}
          className="justify-start"
        >
          Filter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          leftIcon={<FiDownload />}
          className="justify-start"
        >
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          leftIcon={<FiUpload />}
          className="justify-start"
        >
          Import
        </Button>
      </div>
    </aside>
  );
};

export default CRUDSidebar;
