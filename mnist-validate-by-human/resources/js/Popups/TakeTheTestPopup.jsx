import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { Link } from '@inertiajs/react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

export default function TakeTheTestPopup({ show, onClose }) {
    const [captchaValue, setCaptchaValue] = useState(null);

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };
    
    const handleYesClick = async () => {
        if (captchaValue) {
            try {
                const response = await axios.post('/recaptcha/verify', {
                    captchaResponse: captchaValue // A reCAPTCHA válasz értékének átadása a backend-nek
                });
                
                if (response.data.success) {
                    // A ReCAPTCHA válasz sikeres, engedélyezzük a felhasználó műveletét
                    onClose();
                } else {
                    // A ReCAPTCHA válasz sikertelen, kezeljük a hibát (pl. hibaüzenet megjelenítése)
                    console.log("Invalid reCAPTCHA response.");
                }
            } catch (error) {
                console.error('Error verifying reCAPTCHA:', error);
            }
        } else {
            console.log("Please fill in the reCAPTCHA.");
        }
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
                                className={`bg-green-custom text-white rounded-full font-bold py-2 px-4 hover:bg-emerald-600 mr-4 ${!captchaValue && 'cursor-not-allowed opacity-50'}`}
                                onClick={handleYesClick}
                                disabled={!captchaValue}
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
                    <div className="mt-4">
                        <ReCAPTCHA
                            sitekey="6Le0v38pAAAAAJ8F0jvrasL3E1VcEm3ikoUk7Wm9"
                            onChange={handleCaptchaChange}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );    
}
