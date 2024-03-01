import React from 'react';
import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';

export default function TakeTheTestPopup({ show, onClose }) {
    const handleYesClick = () => {
        // Handle Yes click action
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <p>You will see 10 pictures, decide what number you see.</p>
                <p>Would you like to start?</p>
                <div className="mt-4 flex justify-center flex-col items-center">
                    <div className="flex">
                        <Link href={route('test')}>
                            <button
                                className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4"
                                onClick={handleYesClick}
                            >
                                Yes
                            </button>
                        </Link>
                        <Link>
                            <button
                                className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700"
                                onClick={onClose}
                            >
                                No
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
