import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faBatteryHalf } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/Components/Modal';
import FeedbackPopup from '@/Popups/FeedbackPopup';
import ExitConfirmationPopup from '@/Popups/ExitConfirmationPopup'; // Import the new component

export default function Survey() {
    const [imageId, setImageId] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [imageCount, setImageCount] = useState(0);
    const [surveyEnded, setSurveyEnded] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // State to control feedback popup visibility
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false); // State to disable next button after click

    useEffect(() => {
        handleTakeTest();
    }, []);

    const handleTakeTest = async () => {
        try {
            setLoading(true);
            if (imageCount >= 3) {
                setSurveyEnded(true);
                setShowFeedbackPopup(true); // Show feedback popup when survey ends
                setLoading(false);
                return;
            }
            const response = await axios.get('/api/generate-image');
            const { image_id, image_label, image_base64 } = response.data;
            setImageId(image_id);
            setImageLabel(image_label);
            setImageBase64(`data:image/png;base64,${image_base64}`);
            setSelectedNumber(null);
            setLoading(false);
            setImageCount(prevCount => prevCount + 1);
            setNextButtonDisabled(false); // Re-enable next button for new image
        } catch (error) {
            console.error('Error taking the test:', error);
            setLoading(false);
        }
    };

    const handleNumberSelection = (number) => {
        setSelectedNumber(number);
    };

    const handleNext = async () => {
        try {
            if (selectedNumber === null) {
                console.log('Please select a number before proceeding.');
                return;
            }
            setLoading(true);
            console.log('Image ID:', imageId);
            console.log('Selected Number:', selectedNumber);

            const response = await axios.post('/api/save-response', {
                image_id: imageId,
                guest_response: selectedNumber
            });

            console.log('Response from server:', response.data);

            handleTakeTest();
        } catch (error) {
            console.error('Error saving response:', error);
            setLoading(false);
        } finally {
            setNextButtonDisabled(true); // Disable next button after click
        }
    };

    const handleExit = () => {
        setShowExitModal(true);
    };

    const handleExitConfirmed = () => {
        window.location.href = '/mnist-human-validation';
    };

    return (
        <div>
            <ExitConfirmationPopup
                show={showExitModal}
                onClose={() => setShowExitModal(false)}
                onConfirm={handleExitConfirmed}
            />

            <FeedbackPopup
                show={showFeedbackPopup}
                onClose={() => setShowFeedbackPopup(false)}
            />

            <div className="bg-gray-127 min-h-screen flex justify-center items-center">
                <div className="container bg-gray-194 rounded-lg p-12 flex justify-center items-center relative">
                    <FontAwesomeIcon icon={faTimes} style={{ color: "#000000" }} className="absolute top-0 right-2 cursor-pointer fa-2x" onClick={handleExit} />
                    {imageId ? (
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="image-container mb-8 md:mb-0 mr-4">
                                {imageBase64 && <img src={imageBase64} alt="MNIST Image" className="max-w-3/4 max-h-3/4" />}
                            </div>
                            <div className="flex flex-col">
                                <div className="number-buttons grid grid-cols-3 gap-4 mb-8">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0].map((number) => (
                                        number !== null ? (
                                            <button
                                                key={number}
                                                onClick={() => handleNumberSelection(number)}
                                                className={`text-lg rounded-lg py-2 px-9 ${
                                                    selectedNumber === number ? 'bg-gray-127 text-white' : 'bg-gray-43 text-white'
                                                } hover:bg-gray-127`}
                                                disabled={surveyEnded}
                                            >
                                                {number}
                                            </button>
                                        ) : (
                                            <div key="empty"></div>
                                        )
                                    ))}
                                </div>
                                <button
                                    className={`text-lg bg-green-custom text-white rounded-full py-2 px-4 hover:bg-emerald-600 ${selectedNumber !== null && selectedNumber !== undefined && !surveyEnded ? '' : 'opacity-50 cursor-not-allowed'}`}
                                    onClick={handleNext}
                                    disabled={selectedNumber === null || selectedNumber === undefined || surveyEnded || nextButtonDisabled}
                                >
                                    {loading ? <FontAwesomeIcon icon={faSpinner} spin size="lg" style={{color: "#ffffff",}} /> : "Next"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-900 text-lg">
                            <FontAwesomeIcon icon={faBatteryHalf} beatFade size="2xl" style={{color: "#000000"}} />
                            <h1>Loading... Please wait.</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
