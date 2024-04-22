import React from 'react';

const DeleteWarningPopup = ({ selectedRows, onDeleteConfirm, onDeleteCancel }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md">
                <h2 className="text-2xl font-bold mb-4">Delete Warning</h2>
                <p className="mb-4">Are you sure you want to delete the following records?</p>
                <p className="mb-2">Total records: {selectedRows.length}</p>
                <div className="flex justify-center">
                    <button className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md mr-2" onClick={onDeleteConfirm}>
                        Yes
                    </button>
                    <button className="text-white bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded-md" onClick={onDeleteCancel}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteWarningPopup;
