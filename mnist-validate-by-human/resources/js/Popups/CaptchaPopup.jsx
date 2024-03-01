import React from 'react';
import Modal from '@/Components/Modal';
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CaptchaPopup({ show, onClose, onCaptchaChange }) {
    const handleExit = () => {
        onClose();
        window.location.href = '/mnist-human-validation'; 
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <div className="text-center">
                    <div className="absolute top-0 right-2">
                        <button
                            type="button"
                            onClick={handleExit}
                        >
                            <FontAwesomeIcon icon={faTimes} style={{ color: "#000000" }} className="fa-2x"/>
                        </button>


                    </div>
                    <h1>To complete the test, please fill in the captcha.</h1>
                    <div className="mx-auto" style={{ width: 'fit-content' }}>
                        <ReCAPTCHA
                            sitekey="6Le0v38pAAAAAJ8F0jvrasL3E1VcEm3ikoUk7Wm9"
                            onChange={onCaptchaChange}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
