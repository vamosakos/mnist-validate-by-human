import React, { useState } from 'react';
import ImageDetailPopup from '@/Popups/ImageDetailPopup';
import DeleteWarningPopup from '@/Popups/DeleteWarningPopup'; 
import axios from 'axios';

const DataTable = ({ data, columns, deleteRoute }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [visibleRows, setVisibleRows] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      axios.post(deleteRoute, { selectedRows })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Hiba történt a törlés során:', error);
        });
    } else {
      console.log('Nincsenek kiválasztott sorok a törléshez.');
    }
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
    setVisibleRows(prevVisibleRows => prevVisibleRows + 10);
  };

  const handleRowClick = (rowId) => {
    setSelectedRow(rowId);
  };

  const handleToggleSelect = (rowId) => {
    const selectedIndex = selectedRows.indexOf(rowId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, rowId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleData.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleClosePopup = () => {
    setSelectedRow(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto max-h-100">
        <table className="w-full text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-800 dark:bg-gray-600 dark:text-gray-400 sticky top-0 text-center align-middle">
            <tr>
              {columns.map((columnName) => (
                <th
                  key={columnName}
                  scope="col"
                  className="cursor-pointer px-6 py-3 text-white hover:bg-gray-700 dark:hover:bg-gray-400"
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
              <th className="px-6 py-3 text-white hover:bg-gray-700 dark:hover:bg-gray-400">
                <input type="checkbox" checked={selectAll} onChange={handleToggleSelectAll} />
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b dark:border-gray-700 cursor-pointer group hover:bg-gray-300 dark:hover:bg-gray-500 ${
                  index % 2 === 0 ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'
                }`}
                onClick={() => handleRowClick(item.id)}
              >
                {columns.map((columnName) => (
                  <td key={columnName} className="px-6 py-4 text-black text-center align-middle">
                    {item[columnName]}
                  </td>
                ))}
                <td className="px-6 py-4 text-black text-center align-middle">
                  <input type="checkbox" checked={selectedRows.includes(item.id)} onChange={() => handleToggleSelect(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleRows < sortedData.length && (
        <button className="text-xl bg-gray-800 dark:bg-gray-600 text-white py-3 px-14 hover:bg-gray-700 dark:hover:bg-gray-400" onClick={handleShowMore}>
          Show more
        </button>
      )}
      <div className="flex justify-end">
        <button className="text-xl bg-gray-800 dark:bg-gray-600 text-white py-3 px-14 hover:bg-gray-700 dark:hover:bg-gray-400" onClick={() => setShowDeleteWarning(true)}>
          Delete
        </button>
      </div>
      {showDeleteWarning && (
        <DeleteWarningPopup
          selectedRows={selectedRows}
          onDeleteConfirm={() => {
            setShowDeleteWarning(false);
            handleDeleteSelected();
          }}
          onDeleteCancel={() => setShowDeleteWarning(false)}
        />
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
