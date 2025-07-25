'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibilityContext } from './AccessibilityProvider';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Filter, Search } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  description?: string;
  type?: 'text' | 'number' | 'date' | 'status';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableData {
  [key: string]: any;
}

interface AccessibleDataTableProps {
  columns: TableColumn[];
  data: TableData[];
  caption?: string;
  summary?: string;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: string[]) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string>) => void;
  className?: string;
  rowIdKey?: string;
  emptyMessage?: string;
}

export function AccessibleDataTable({
  columns,
  data,
  caption,
  summary,
  sortable = false,
  filterable = false,
  selectable = false,
  onRowSelect,
  onSort,
  onFilter,
  className,
  rowIdKey = 'id',
  emptyMessage = 'No data available'
}: AccessibleDataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);
  const { announcePolite } = useAccessibilityContext();

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    let newDirection: 'asc' | 'desc' = 'asc';
    if (sortColumn === columnKey && sortDirection === 'asc') {
      newDirection = 'desc';
    }
    
    setSortColumn(columnKey);
    setSortDirection(newDirection);
    onSort?.(columnKey, newDirection);
    
    const column = columns.find(col => col.key === columnKey);
    announcePolite(`Table sorted by ${column?.label} ${newDirection}ending`);
  };

  // Handle filtering
  const handleFilter = (columnKey: string, value: string) => {
    const newFilters = { ...filters, [columnKey]: value };
    if (!value) {
      delete newFilters[columnKey];
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
    
    const activeFilters = Object.keys(newFilters).length;
    announcePolite(`${activeFilters} filter${activeFilters !== 1 ? 's' : ''} applied`);
  };

  // Handle row selection
  const handleRowSelect = (rowId: string, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
    
    announcePolite(`Row ${selected ? 'selected' : 'deselected'}. ${newSelected.size} rows selected`);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = new Set(data.map(row => row[rowIdKey]));
      setSelectedRows(allIds);
      onRowSelect?.(Array.from(allIds));
      announcePolite(`All ${data.length} rows selected`);
    } else {
      setSelectedRows(new Set());
      onRowSelect?.([]);
      announcePolite('All rows deselected');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return;

      const { row, col } = focusedCell;
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRow = Math.min(data.length - 1, row + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newCol = Math.min(columns.length - 1, col + 1);
          break;
        case 'Home':
          e.preventDefault();
          if (e.ctrlKey) {
            newRow = 0;
            newCol = 0;
          } else {
            newCol = 0;
          }
          break;
        case 'End':
          e.preventDefault();
          if (e.ctrlKey) {
            newRow = data.length - 1;
            newCol = columns.length - 1;
          } else {
            newCol = columns.length - 1;
          }
          break;
        case ' ':
          if (selectable) {
            e.preventDefault();
            const rowId = data[row][rowIdKey];
            handleRowSelect(rowId, !selectedRows.has(rowId));
          }
          break;
      }

      if (newRow !== row || newCol !== col) {
        setFocusedCell({ row: newRow, col: newCol });
        
        // Focus the cell
        const cell = tableRef.current?.querySelector(
          `tbody tr:nth-child(${newRow + 1}) td:nth-child(${newCol + (selectable ? 2 : 1)})`
        ) as HTMLElement;
        cell?.focus();
      }
    };

    if (focusedCell) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [focusedCell, data.length, columns.length, selectable, selectedRows, data, rowIdKey]);

  const filteredData = data; // In real implementation, apply filters here
  const sortedData = filteredData; // In real implementation, apply sorting here

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Table Controls */}
      {filterable && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.filter(col => col.filterable).map(column => (
              <div key={`filter-${column.key}`}>
                <label
                  htmlFor={`filter-${column.key}`}
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Filter {column.label}
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                  <input
                    id={`filter-${column.key}`}
                    type="text"
                    value={filters[column.key] || ''}
                    onChange={(e) => handleFilter(column.key, e.target.value)}
                    className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={`Filter by ${column.label.toLowerCase()}`}
                    aria-describedby={`filter-${column.key}-desc`}
                  />
                </div>
                <div id={`filter-${column.key}-desc`} className="sr-only">
                  Filter the table by {column.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table
          ref={tableRef}
          className="w-full divide-y divide-gray-200"
          role="table"
          aria-label={caption || 'Data table'}
        >
          {/* Caption */}
          {caption && (
            <caption className="px-6 py-4 text-sm text-gray-600 text-left bg-gray-50">
              {caption}
              {summary && (
                <div className="mt-1 text-xs text-gray-500">{summary}</div>
              )}
            </caption>
          )}

          {/* Header */}
          <thead className="bg-gray-50">
            <tr role="row">
              {selectable && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    sortable && column.sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  onClick={() => sortable && column.sortable && handleSort(column.key)}
                  aria-sort={
                    sortColumn === column.key
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : sortable && column.sortable ? 'none' : undefined
                  }
                  role="columnheader"
                  tabIndex={sortable && column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && sortable && column.sortable) {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            "w-3 h-3 -mb-1",
                            sortColumn === column.key && sortDirection === 'asc'
                              ? "text-orange-600" : "text-gray-400"
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            "w-3 h-3",
                            sortColumn === column.key && sortDirection === 'desc'
                              ? "text-orange-600" : "text-gray-400"
                          )} 
                        />
                      </div>
                    )}
                  </div>
                  {column.description && (
                    <div className="sr-only">{column.description}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                  role="cell"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const rowId = row[rowIdKey];
                const isSelected = selectedRows.has(rowId);
                
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      "hover:bg-gray-50",
                      isSelected && "bg-orange-50"
                    )}
                    role="row"
                    aria-selected={selectable ? isSelected : undefined}
                  >
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    
                    {columns.map((column, colIndex) => {
                      const cellValue = row[column.key];
                      const isFirstCol = colIndex === 0;
                      
                      return (
                        <td
                          key={`${rowId}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          role={isFirstCol ? "rowheader" : "cell"}
                          tabIndex={0}
                          onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                          onBlur={() => setFocusedCell(null)}
                          aria-describedby={column.description ? `desc-${column.key}` : undefined}
                        >
                          {column.render ? column.render(cellValue, row) : cellValue}
                          {column.description && (
                            <div id={`desc-${column.key}`} className="sr-only">
                              {column.description}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {sortedData.length} {sortedData.length === 1 ? 'row' : 'rows'}
          {selectable && selectedRows.size > 0 && (
            <span className="ml-2">
              ({selectedRows.size} selected)
            </span>
          )}
        </div>
        
        {(sortColumn || Object.keys(filters).length > 0) && (
          <div className="flex items-center space-x-4">
            {sortColumn && (
              <span>
                Sorted by {columns.find(col => col.key === sortColumn)?.label} ({sortDirection})
              </span>
            )}
            {Object.keys(filters).length > 0 && (
              <span>
                {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} applied
              </span>
            )}
          </div>
        )}
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {focusedCell && (
          <span>
            Row {focusedCell.row + 1}, Column {focusedCell.col + 1}: 
            {columns[focusedCell.col]?.label}
          </span>
        )}
      </div>

      {/* Keyboard shortcuts help */}
      <details className="mt-4">
        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
          Keyboard Shortcuts
        </summary>
        <div className="mt-2 text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><kbd className="bg-gray-100 px-1 rounded">↑↓←→</kbd> Navigate cells</div>
          <div><kbd className="bg-gray-100 px-1 rounded">Home/End</kbd> First/last column</div>
          <div><kbd className="bg-gray-100 px-1 rounded">Ctrl+Home/End</kbd> First/last cell</div>
          {selectable && <div><kbd className="bg-gray-100 px-1 rounded">Space</kbd> Select row</div>}
          {sortable && <div><kbd className="bg-gray-100 px-1 rounded">Enter</kbd> Sort column</div>}
        </div>
      </details>
    </div>
  );
}