import React, { useState, useEffect } from 'react';
import ImageDetailPopup from '@/Popups/ImageDetailPopup';
import DeleteWarningPopup from '@/Popups/DeleteWarningPopup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const DataTable = ({ data, columns, deleteRoute, onDataUpdate }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
    const [visibleRows, setVisibleRows] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolledDown, setScrolledDown] = useState(false);

    useEffect(() => {
        handleSort('image_id');

        const handleScroll = () => {
            setScrolledDown(window.pageYOffset > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        onDataUpdate(data);
    }, [data, onDataUpdate]);

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
                .then((response) => {
                    console.log(response.data.message);
                    onDataUpdate(data.filter((item) => !selectedRows.includes(item.id)));
                })
                .catch((error) => {
                    console.error('Error occurred during deletion:', error);
                });
        } else {
            console.log('No selected rows for deletion.');
        }
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const filteredData = sortedData.filter((item) =>
        Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const visibleData = filteredData.slice(0, visibleRows);

    const handleShowMore = () => {
        setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
    };

    const handleRowClick = (rowId, event) => {
        if (event.target.type === 'checkbox') return;

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
            newSelected = newSelected.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
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
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    maxLength={128}
                    className="p-2 border border-gray-300 rounded-md mr-2"
                />
            </div>
            <div className="flex-1 overflow-y-auto max-h-100">
                <table className="w-full text-sm text-left text-gray-700 bg-white border-gray-300 border">
                    <thead className="text-xs uppercase bg-gray-200">
                        <tr>
                            {columns.map((columnName) => (
                                <th
                                    key={columnName}
                                    scope="col"
                                    className="px-6 py-3 border-b dark:text-gray-400 cursor-pointer table-cell-text"
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
                            <th className="px-6 py-3 border-b">
                                <input type="checkbox" checked={selectAll} onChange={handleToggleSelectAll} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleData.map((item, index) => (
                            <tr
                                key={item.id}
                                className={`border-b cursor-pointer group hover:bg-gray-100 ${
                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-200'
                                }`}
                                onClick={(event) => handleRowClick(item.id, event)}
                            >
                                {columns.map((columnName) => (
                                    <td key={columnName} className="px-6 py-4 text-black table-cell-text">
                                        {item[columnName].length > 21 ? `${item[columnName].slice(0, 21)}...` : item[columnName]}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-black">
                                    <input type="checkbox" checked={selectedRows.includes(item.id)} onChange={() => handleToggleSelect(item.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{visibleData.length} / {sortedData.length}</span>
                <div className="flex justify-end">
                    <FontAwesomeIcon icon={faTrashCan} size="xl" className="custom-icon" onClick={() => setShowDeleteWarning(true)} />
                </div>
            </div>
            <div className="flex justify-center mt-2">
                {visibleRows < sortedData.length && (
                    <button className="text-gray-500 hover:text-gray-800" onClick={handleShowMore}>
                        Show more
                    </button>
                )}
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
            {scrolledDown && (
                <button className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600" onClick={handleScrollToTop}>
                    Back to Top
                </button>
            )}
        </div>
    );
};

export default DataTable;
