import React from 'react';
import Modal from '@/Components/Modal';

export default function ExitConfirmationPopup({ show, onClose, onConfirm }) {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6 text-center">
                <p>Are you sure you want to exit?</p>
                <div className="mt-4 flex justify-center">
                    <button onClick={onConfirm} className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4">
                        Yes
                    </button>
                    <button onClick={onClose} className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700 mr-4">
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
}
