import React from 'react';
import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';

export default function StartPopup({ show, onClose }) {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <p>You will see 10 pictures, decide what number you see.</p>
                <p>Would you like to start?</p>
                <div className="mt-4 flex justify-center">
                    <Link
                        href={route('test')} // Assuming route is available for navigation
                        className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4"
                        onClick={onClose}
                    >
                        Yes
                    </Link>
                    <button
                        className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700 mr-4"
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </Modal>
    );
}
