import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function FeedbackPopup({ show, onClose }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectCountdown, setRedirectCountdown] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        // Fetch CSRF token on component mount
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('/csrf-token');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleFeedbackChange = (event) => {
        setFeedbackText(event.target.value);
    };

    const handleSubmit = async () => {
        if (isSubmitting || isCountdownActive) return;
        if (feedbackText.trim() === '') {
            console.log('Please enter your feedback before submitting.');
            return;
        }
        setIsSubmitting(true);

        try {
            const feedbackData = {
                comment: feedbackText
            };

            const response = await axios.post('/api/feedbacks', feedbackData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (response.status === 201) {
                setSuccessMessage('Thank you for your feedback!');
                startRedirectCountdown();
            } else {
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const startRedirectCountdown = () => {
        setIsCountdownActive(true);
        const timer = setInterval(() => {
            setRedirectCountdown((prevCount) => prevCount - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            setIsCountdownActive(false);
            redirectToMainPage();
        }, 5000);
    };

    const redirectToMainPage = () => {
        window.location.href = '/mnist-human-validation';
        onClose();
    };

    const handleCancel = () => {
        window.location.href = '/mnist-human-validation';
        onClose();
    };

    useEffect(() => {
        if (!show) {
            setSuccessMessage('');
            setRedirectCountdown(5);
        }
    }, [show]);

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">Feedback</h2>
                    <FontAwesomeIcon icon={faStar} size="lg" style={{color: "#FFD43B",}} />
                    <FontAwesomeIcon icon={faStar} size="lg" style={{color: "#FFD43B",}} />
                    <FontAwesomeIcon icon={faStar} size="lg" style={{color: "#FFD43B",}} />
                    <FontAwesomeIcon icon={faStar} size="lg" style={{color: "#FFD43B",}} />
                    <FontAwesomeIcon icon={faStar} size="lg" style={{color: "#FFD43B",}} />
                </div>
                <div className="mb-4">
                    <label htmlFor="feedback-text" className="block mb-1">Your Feedback:</label>
                    <textarea
                        id="feedback-text"
                        rows={8}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-700"
                        value={feedbackText}
                        onChange={handleFeedbackChange}
                    />
                </div>
                <div className="text-center">
                    <form id="feedback-form" method="post" action="/api/feedbacks">
                        <input type="hidden" name="_token" value={csrfToken} />
                        <button
                            type="button"
                            className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4"
                            onClick={handleSubmit}
                            disabled={isSubmitting || isCountdownActive}
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
                {successMessage && (
                    <div className="text-center mt-4 text-green-700">
                        {successMessage}
                        {redirectCountdown > 0 && (
                            <div className="mt-2">
                                Redirecting to the main page in {redirectCountdown} seconds...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
