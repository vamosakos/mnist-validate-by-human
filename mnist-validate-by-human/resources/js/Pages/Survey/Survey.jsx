import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faBatteryHalf, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import CaptchaPopup from '@/Popups/CaptchaPopup';
import FeedbackPopup from '@/Popups/FeedbackPopup';
import ExitConfirmationPopup from '@/Popups/ExitConfirmationPopup';
import { v4 as uuidv4 } from 'uuid';

export default function Survey() {
    const [imageId, setImageId] = useState(null);
    const [imageLabel, setImageLabel] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showExitModal, setShowExitModal] = useState(false);
    const [imageCount, setImageCount] = useState(0);
    const [surveyEnded, setSurveyEnded] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
    const [numberButtonsDisabled, setNumberButtonsDisabled] = useState(true);
    const [progressBarVisible, setProgressBarVisible] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [showCaptchaPopup, setShowCaptchaPopup] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [feedbackPopupVisible, setFeedbackPopupVisible] = useState(false);
    const [responseProcessed, setResponseProcessed] = useState(true);
    const [tempResponses, setTempResponses] = useState([]);

    useEffect(() => {
        if (captchaVerified) {
            handleTakeTest();
            setShowCaptchaPopup(false);
            setShowWarning(false);
        }
    }, [captchaVerified]);

    useEffect(() => {
        setShowWarning(false);

        if (!showFeedbackPopup && !feedbackPopupVisible) {
            const warningTimer = setTimeout(() => {
                setShowWarning(true);
            }, Math.max(0, startTime ? 25000 - (Date.now() - startTime.getTime()) : 0));

            return () => clearTimeout(warningTimer);
        } else if (showFeedbackPopup && !feedbackPopupVisible) {
            setShowWarning(false);
        }
    }, [startTime, showFeedbackPopup, feedbackPopupVisible]);

    useEffect(() => {
        setShowWarning(!showFeedbackPopup && !feedbackPopupVisible);
    }, [showFeedbackPopup, feedbackPopupVisible]);

    useEffect(() => {
        if (startTime && showWarning) {
            const timeoutId = setTimeout(() => {
                handleNext();
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [startTime, showWarning]);

    const handleTakeTest = async () => {
        try {
            if (loading) setLoading(false);
            if (imageCount >= 10) {
                setSurveyEnded(true);
                setShowFeedbackPopup(true);
                setFeedbackPopupVisible(true);
                return;
            }
            setLoading(true);
            const clientToken = localStorage.getItem('clientToken') || generateClientToken();
            const response = await axios.get('/api/generate-image', {
                headers: {
                    'X-Client-Token': clientToken
                }
            });
            const { image_id, image_label, image_base64 } = response.data;
            setImageId(image_id);
            setImageLabel(image_label);
            setImageBase64(`data:image/png;base64,${image_base64}`);
            setSelectedNumber(null);
            setStartTime(new Date());
            setImageCount((prevCount) => prevCount + 1);
            setProgressBarVisible(true);
            setNextButtonDisabled(false);
            setNumberButtonsDisabled(false);
            setResponseProcessed(true);
        } catch (error) {
            console.error('Error taking the test:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateClientToken = () => {
        const token = generateRandomToken();
        localStorage.setItem('clientToken', token);
        return token;
    };

    const generateRandomToken = () => {
        return uuidv4();
    };

    const handleNumberSelection = (number) => {
        setSelectedNumber(number);
    };

    const handleNext = async () => {
        try {
            if (selectedNumber === null && startTime) {
                console.log('No response within the time limit.');
                handleTakeTest();
                return;
            }
    
            if (selectedNumber !== null && responseProcessed) {
                const endTime = new Date();
                const responseTime = endTime - startTime;
    
                setLoading(true);
                setResponseProcessed(false);
    
                const tempResponse = {
                    image_id: imageId,
                    guest_response: selectedNumber,
                    response_time: responseTime,
                };
    
                const updatedTempResponses = [...tempResponses, tempResponse];
                console.log('Temporary responses:', updatedTempResponses);
                setTempResponses(updatedTempResponses);
            }
    
            handleTakeTest();
        } catch (error) {
            console.error('Error handling next:', error);
        } finally {
            setNextButtonDisabled(true);
            setNumberButtonsDisabled(true);
        }
    };

    useEffect(() => {
        if (showFeedbackPopup) {
            saveMultipleResponses(tempResponses);
            setTempResponses([]);
        }
    }, [showFeedbackPopup]);


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

    const handleExit = () => {
        setShowExitModal(true);
    };

    const handleExitConfirmed = () => {
        window.location.href = '/mnist-human-validation';
    };

    const handleCaptchaChange = (value) => {
        setCaptchaVerified(true);
    };

    const progressBarWidth = (imageCount / 10) * 100;

    return (
        <div>
            <Head title="Test" />
            <CaptchaPopup
                show={showCaptchaPopup}
                onClose={() => setShowCaptchaPopup(false)}
                onCaptchaChange={handleCaptchaChange}
            />

            <ExitConfirmationPopup
                show={showExitModal}
                onClose={() => setShowExitModal(false)}
                onConfirm={handleExitConfirmed}
                tempResponses={tempResponses}
            />

            <FeedbackPopup 
                show={showFeedbackPopup} 
                onClose={() => setShowFeedbackPopup(false)} 
                tempResponses={tempResponses} 
            />

            <div className="bg-gray-127 min-h-screen flex justify-center items-center">
                <div className="container bg-gray-194 rounded-lg p-12 flex justify-center items-center relative">
                    <FontAwesomeIcon
                        icon={faTimes}
                        style={{ color: '#000000' }}
                        className="absolute top-0 right-0 m-4 cursor-pointer fa-2x"
                        onClick={handleExit}
                    />
                    {captchaVerified && !imageBase64 && (
                        <div className="text-center text-gray-900 text-lg">
                            <FontAwesomeIcon
                                icon={faBatteryHalf}
                                beatFade
                                size="2xl"
                                style={{ color: '#000000' }}
                            />
                            <h1>Loading... Please wait.</h1>
                        </div>
                    )}
                    {captchaVerified && imageBase64 && (
                        <div>
                            <div className="text-center text-gray-900 text-lg mb-4">
                                {showWarning && (
                                    <div className="bg-yellow-400 text-black rounded-md p-4">
                                        <FontAwesomeIcon icon={faExclamationTriangle} beatFade size="2xl" className="mr-2" />
                                        <span>Warning: Response time is almost up! Choose a number and click on the Next button.</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="image-container mb-8 md:mb-8 mr-4">
                                    {imageBase64 && (
                                        <img src={imageBase64} alt="MNIST Image" className="max-w-3/4 max-h-3/4" />
                                    )}
                                </div>
                                <div className="w-8 md:w-20"></div>
                                <div className="flex flex-col">
                                    <div className="number-buttons grid grid-cols-3 gap-4 mb-8">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0].map((number) =>
                                            number !== null ? (
                                                <button
                                                    key={number}
                                                    onClick={() => handleNumberSelection(number)}
                                                    className={`text-lg rounded-lg py-2 px-9 ${
                                                        selectedNumber === number
                                                            ? 'bg-gray-127 text-white'
                                                            : 'bg-gray-43 text-white'
                                                    } hover:bg-gray-127`}
                                                    disabled={surveyEnded || numberButtonsDisabled}
                                                >
                                                    {number}
                                                </button>
                                            ) : (
                                                <div key="empty"></div>
                                            )
                                        )}
                                    </div>
                                    <button
                                        className={`text-lg bg-green-custom text-white rounded-full py-2 px-4 hover:bg-emerald-600 ${
                                            selectedNumber !== null && selectedNumber !== undefined && !surveyEnded && responseProcessed
                                                ? ''
                                                : 'opacity-50 cursor-not-allowed'
                                        }`}
                                        onClick={handleNext}
                                        disabled={
                                            selectedNumber === null || selectedNumber === undefined || surveyEnded || !responseProcessed
                                        }
                                    >
                                        {loading ? (
                                            <FontAwesomeIcon
                                                icon={faSpinner}
                                                spin
                                                size="lg"
                                                style={{ color: '#ffffff' }}
                                            />
                                        ) : (
                                            'Next'
                                        )}
                                    </button>
                                </div>
                            </div>
                            {progressBarVisible && (
                                <div className="container bg-gray-600 h-4 rounded mb-4 absolute bottom-0 left-0">
                                    <div
                                        className="bg-green-custom h-full"
                                        style={{ width: `${progressBarWidth}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
