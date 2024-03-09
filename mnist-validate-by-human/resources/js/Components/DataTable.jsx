import React, { useState } from 'react';

const DataTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [visibleRows, setVisibleRows] = useState(10);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key && a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    if (sortConfig.key && a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    return 0;
  });

  const visibleData = sortedData.slice(0, visibleRows);

  const handleShowMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto max-h-96">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
            <tr>
              {columns.map((columnName) => (
                <th
                  key={columnName}
                  scope="col"
                  className="px-6 py-3"
                  onClick={() => handleSort(columnName)}
                >
                  {columnName}
                  {sortConfig.key === columnName && (
                    <span className={`ml-1 ${sortConfig.direction === 'asc' ? 'text-asc' : 'text-desc'}`}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item) => (
              <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {columns.map((columnName) => (
                  <td key={columnName} className="px-6 py-4">
                    {item[columnName]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 'Show more' button outside the DataTable component */}
      {visibleRows < sortedData.length && (
        <button className="mt-2 text-blue-500" onClick={handleShowMore}>
          Show more
        </button>
      )}
    </div>
  );
};

export default DataTable;
