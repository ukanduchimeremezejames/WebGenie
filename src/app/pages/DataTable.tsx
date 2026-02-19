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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              {columns.map((column) => {
                const isActive = sortKey === column.key;

                return (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-2 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                        aria-sort={
                          isActive
                            ? sortDirection === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        {column.label}

                        {isActive ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-4 h-4" />
                          ) : (
                            <ArrowDown className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-40" />
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {sortedData.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                className={
                  onRowClick
                    ? 'cursor-pointer hover:bg-accent transition-colors'
                    : undefined
                }
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-foreground"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}

            {sortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
