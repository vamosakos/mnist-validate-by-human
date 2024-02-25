import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export default function FeedbackPopup({ show, onClose }) {
    const [feedbackText, setFeedbackText] = useState('');
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown before redirection

    const handleFeedbackChange = (event) => {
        setFeedbackText(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Prepare data to send to the backend
            const feedbackData = {
                comment: feedbackText,
                email: email,
            };
    
            // Send POST request to the backend
            const response = await axios.post('/api/feedbacks', feedbackData);
    
            // Check if the response is successful
            if (response.status === 201) {
                // Display success message
                setSuccessMessage('Thank you for your feedback!');
                // Start countdown for redirection
                startRedirectCountdown();
            } else {
                // Handle errors
                throw new Error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            // You can handle errors here, such as displaying an error message to the user
        }
    };

    const startRedirectCountdown = () => {
        const timer = setInterval(() => {
            setRedirectCountdown((prevCount) => prevCount - 1);
        }, 1000);

        // After 3 seconds, redirect to the main page
        setTimeout(() => {
            clearInterval(timer);
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
        // Clear success message and redirect countdown on modal close
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
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Your Email (optional):</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-700"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <div className="text-center">
                    <button
                        className="bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
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
