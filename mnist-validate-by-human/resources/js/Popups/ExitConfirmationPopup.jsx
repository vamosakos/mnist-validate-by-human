import React from 'react';
import Modal from '@/Components/Modal';

export default function ExitConfirmationPopup({ show, onClose, tempResponses, onConfirm }) {
    const handleConfirm = async () => {
        await saveTempResponsesToDatabase();
        onConfirm();
    };

    const saveTempResponsesToDatabase = async () => {
        try {
            await saveMultipleResponses(tempResponses);
            console.log('Saving temporary responses to database...');
        } catch (error) {
            console.error('Error saving temporary responses to database:', error);
        }
    };

    const saveMultipleResponses = async (responses) => {
        try {
            const response = await axios.post('/api/save-multiple-responses', {
                responses: responses,
            });
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error saving multiple responses:', error);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4 text-center">Exit</h2>
                <p>Are you sure you want to exit?</p>
                <div className="mt-4 flex justify-center">
                    <button onClick={handleConfirm} className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4">
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
