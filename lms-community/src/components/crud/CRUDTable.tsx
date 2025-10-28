'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { TableColumn, TableData } from '@/types';
import {
  FiChevronUp,
  FiChevronDown,
  FiChevronsUp,
  FiChevronsDown,
  FiSearch,
} from 'react-icons/fi';
import Loading from '../shared/Loading';

interface CRUDTableProps {
  columns: TableColumn[];
  data: TableData[];
  selectable?: boolean;
  onSelect?: (selectedIds: (string | number)[]) => void;
  onRowClick?: (row: TableData) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const CRUDTable: React.FC<CRUDTableProps> = ({
  columns,
  data,
  selectable = true,
  onSelect,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
  className,
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? data.map((row) => row.id) : [];
    setSelectedIds(newSelected);
    onSelect?.(newSelected);
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = checked
      ? [...selectedIds, id]
      : selectedIds.filter((selectedId) => selectedId !== id);
    setSelectedIds(newSelected);
    onSelect?.(newSelected);
  };

  const isSelected = (id: string | number) => selectedIds.includes(id);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort data
  let sortedData = [...data];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Filter data
  if (searchQuery) {
    sortedData = sortedData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar border border-gray-200 rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loading variant="spinner" size="lg" text="Loading data..." />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">{emptyMessage}</p>
          </div>
        ) : (
          <table className="table">
            <thead className="table-header sticky top-0 bg-gray-50 z-10">
              <tr>
                {selectable && (
                  <th className="table-header-cell w-12">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'table-header-cell',
                      column.sortable && 'cursor-pointer select-none hover:bg-gray-100'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <FiChevronUp
                            size={12}
                            className={cn(
                              'text-gray-400',
                              sortConfig?.key === column.key &&
                                sortConfig.direction === 'asc' &&
                                'text-primary-600'
                            )}
                          />
                          <FiChevronDown
                            size={12}
                            className={cn(
                              'text-gray-400 -mt-1',
                              sortConfig?.key === column.key &&
                                sortConfig.direction === 'desc' &&
                                'text-primary-600'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.02 }}
                  className={cn(
                    'table-row',
                    onRowClick && 'cursor-pointer',
                    isSelected(row.id) && 'bg-primary-50'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="table-cell" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {sortedData.length} of {data.length} results
            {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDTable;
