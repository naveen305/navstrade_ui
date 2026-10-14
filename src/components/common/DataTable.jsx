import React from 'react';

export const DataTable = ({
  columns = [],
  data = [],
  emptyText = 'No data available',
  onRowClick,
  className = '',
  style = {},
}) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }} className={className}>
      <table className="calm-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width || 'auto',
                  ...col.headerStyle,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  color: 'var(--text-muted)',
                  fontSize: '12.5px',
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={col.isNumeric ? 'font-num num-fade' : ''}
                    style={{
                      textAlign: col.align || 'left',
                      ...col.cellStyle,
                    }}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
