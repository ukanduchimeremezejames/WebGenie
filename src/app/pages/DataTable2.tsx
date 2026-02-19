import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      {column.label}
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="w-4 h-4" /> : 
                          <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 opacity-40" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, idx) => (
              <tr 
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
