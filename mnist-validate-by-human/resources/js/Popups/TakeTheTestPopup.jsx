import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component

export default function TakeTheTestPopup({ show, onClose }) {
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };

    const handleYesClick = () => {
        // Check if captcha is filled
        if (captchaValue) {
            // Place your logic here for when the user clicks "Yes" and the captcha is filled
            onClose(); // Close the modal
            // Proceed with your desired action after captcha validation
        } else {
            // Inform the user to fill in the captcha
            console.log("Please fill in the reCAPTCHA.");
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <p>You will see 10 pictures, decide what number you see.</p>
                <p>Would you like to start?</p>
                <div className="mt-4 flex justify-center">
                    {/* Render reCAPTCHA component */}
                    <ReCAPTCHA
                        sitekey="6Le0v38pAAAAAJ8F0jvrasL3E1VcEm3ikoUk7Wm9"
                        onChange={handleCaptchaChange}
                    />
                    <div className="ml-4 mt-4"> {/* Add margin-left to this div */}
                        <Link href={route('test')}>
                            <button
                                className={`bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4 ${!captchaValue && 'cursor-not-allowed opacity-50'}`}
                                onClick={handleYesClick}
                                disabled={!captchaValue} // Disable the button if captcha is not filled
                            >
                                Yes
                            </button>
                        </Link>
                        <Link>
                            <button
                                className="bg-red-500 text-white rounded-full font-bold py-2 px-4 hover:bg-red-700 mr-4"
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
