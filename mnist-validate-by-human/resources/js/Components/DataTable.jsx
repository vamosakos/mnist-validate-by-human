import React, { useState } from 'react';
import ImageDetailPopup from '@/Popups/ImageDetailPopup';

const DataTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [visibleRows, setVisibleRows] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId);
  };

  const handleClosePopup = () => {
    setSelectedRow(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto max-h-96">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-green-custom dark:bg-green-custom dark:text-gray-400 sticky top-0 text-center align-middle">
            <tr>
              {columns.map((columnName) => (
                <th
                  key={columnName}
                  scope="col"
                  className="cursor-pointer px-6 text-2xl py-3 text-white hover:bg-emerald-600 "
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
            {visibleData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b dark:border-gray-700 cursor-pointer group hover:bg-gray-500 ${
                  index % 2 === 0 ? 'bg-gray-127' : 'bg-gray-194'
                }`}
                onClick={() => handleRowClick(item.id)}
              >
                {columns.map((columnName) => (
                  <td key={columnName} className="px-6 text-2xl py-4 text-black text-center align-middle">
                    {item[columnName]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleRows < sortedData.length && (
        <button className="text-xl bg-green-custom text-white py-3 px-14 hover:bg-emerald-600" onClick={handleShowMore}>
          Show more
        </button>
      )}
      {selectedRow && (
        <ImageDetailPopup
          show={selectedRow !== null}
          onClose={handleClosePopup}
          rowData={sortedData.find((item) => item.id === selectedRow)}
        />
      )}
    </div>
  );
};

export default DataTable;
