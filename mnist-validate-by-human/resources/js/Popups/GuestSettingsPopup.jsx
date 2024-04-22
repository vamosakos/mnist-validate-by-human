import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function GuestSettingsPopup({ show, onClose, existingRecord }) {
    const [major, setMajor] = useState('');
    const [hand, setHand] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [disableButton, setDisableButton] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/json/faculties.json')
            .then(response => response.json())
            .then(data => {
                setFaculties(data);

                if (data.length > 0 && !existingRecord) {
                    setMajor(data[0]);
                }
            })
            .catch(error => console.error('Error fetching faculties:', error));

        if (existingRecord) {
            setMajor(existingRecord.field_of_study);
            setHand(existingRecord.hand);
        }
    }, [existingRecord]);

    const handleSave = () => {
        if (!hand || !major || disableButton) {
            setError('');
            return;
        }

        setDisableButton(true);

        const dataToSend = {
            field_of_study: major,
            hand: hand,
        };

        if (existingRecord) {
            if (major === existingRecord.field_of_study && hand === existingRecord.hand) {
                console.log('The provided data is the same as the existing record. Update aborted.');
                resetButton();
                return;
            }

            axios.put(`/api/guest-settings/${existingRecord.id}`, dataToSend)
                .then(response => {
                    console.log('Data updated successfully:', response.data);
                    onClose();
                })
                .catch(error => {
                    console.error('Error updating data:', error);
                })
                .finally(() => {
                    resetButton();
                });
        } else {
            axios.post('/api/guest-settings', dataToSend)
                .then(response => {
                    console.log('Data saved successfully:', response.data);
                    onClose();
                })
                .catch(error => {
                    console.error('Error saving data:', error);
                })
                .finally(() => {
                    resetButton();
                });
        }
    };

    const resetButton = () => {
        setTimeout(() => {
            setDisableButton(false);
        }, 1000);
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <button onClick={onClose} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900 focus:outline-none">
                    <FontAwesomeIcon icon={faTimes} style={{ color: "#000000" }} className="fa-2x"/>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Settings</h2>
                <div className="flex flex-col mb-4">
                    <label className="text-lg mb-2">Your Major:</label>
                    <select value={major} onChange={e => setMajor(e.target.value)} className="border border-gray-300 p-2 rounded-lg">
                        {faculties.map((faculty, index) => (
                            <option key={index} value={faculty}>{faculty}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="text-lg mb-2">Your Dominant Hand:</label>
                    <div className="flex">
                        <div>
                            <input type="radio" id="left" name="hand" value="left" onChange={() => setHand('left')} checked={hand === 'left'} />
                            <label htmlFor="left" className="ml-2 mr-4">Left</label>
                        </div>
                        <div>
                            <input type="radio" id="right" name="hand" value="right" onChange={() => setHand('right')} checked={hand === 'right'} />
                            <label htmlFor="right" className="ml-2 mr-4">Right</label>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    <button disabled={disableButton} className={`bg-green-custom text-white rounded-full py-3 px-8 hover:bg-emerald-600 ${disableButton ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
