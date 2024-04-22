import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import StartPopup from '@/Popups/TakeTheTestPopup';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';
import SettingsPopup from '@/Popups/GuestSettingsPopup';
import axios from 'axios';

export default function About() {
    const [modalOpen, setModalOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [identificationsCount, setIdentificationsCount] = useState(0);
    const [showSettingsWarning, setShowSettingsWarning] = useState(false);
    const [existingRecord, setExistingRecord] = useState(null);

    useEffect(() => {
        fetchIdentificationsCount();
    
        if (!settingsOpen) {
            checkSession();
        }
    }, [settingsOpen]);

    const fetchIdentificationsCount = async () => {
        try {
            const response = await fetch('/api/identifications/count');
            const data = await response.json();
            setIdentificationsCount(data.count);
        } catch (error) {
            console.error('Error fetching identifications count:', error);
        }
    };

    const checkSession = async () => {
        try {
            const response = await axios.get('/api/check-session-in-guest-settings');
            setShowSettingsWarning(!response.data.exists);

            if (response.data.exists) {
                setExistingRecord(response.data.record);
            }
        } catch (error) {
            console.error('Error checking session in guest settings:', error);
        }
    };

    return (
        <div>
            <Header />

            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    <div className="w-full md:w-1/3 mb-2 md:mb-0">
                        <img src="/content-img.png" alt="Content" className="w-80 h-80 rounded-3xl" />
                    </div>
                    
                    <div className="w-full md:w-2/3 md:pl-6 flex flex-col justify-between text-left">
                        <div>
                            <Head title="About" />
                            <p className="text-4xl font-bold mb-6">What is this?</p>
                            <p className="text-xl mb-6">MNIST is a dataset of grayscale handwritten digits, commonly used to train image processing systems in machine learning and computer vision.   The dataset consists of 70,000 images, each 28x28 pixels in size.</p>
                            <p className="text-xl mb-6">This site includes a test/survey where you can select the number you see from the entire MNIST database.</p>
                            <p className="text-xl mb-6">The website was developed as part of a thesis project with the aim of collecting human responses for MNIST images. Your responses will be used for statistical analysis and research purposes.</p>
                        </div>
                        
                        <div className="flex justify-end">
                            <a href="https://en.wikipedia.org/wiki/MNIST_database" target="_blank" rel="noopener noreferrer" className="text-lg bg-gray-43 text-white rounded-full py-2 px-8 hover:bg-gray-127">
                                Read more
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-127">
                    <button
                        className="text-xl bg-green-custom text-white rounded-full py-3 px-14 hover:bg-emerald-600"
                        onClick={() => setModalOpen(true)}
                    >
                        Take the Test
                    </button>
                </div>

                <div className="text-4xl text-black mt-24 text-center number-animation">
                    A total of <span className="font-bold">{identificationsCount}</span> images identified so far
                </div>
            </div>

            <div 
                style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1000', display: 'flex', alignItems: 'center' }} 
                onClick={() => setSettingsOpen(true)}
                className='number-animation'
            >
                <div style={{ backgroundColor: '#333', borderRadius: '50%', padding: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
                    <FontAwesomeIcon icon={faGears} style={{ color: '#ffffff', fontSize: '24px' }} />
                </div>
                
                {showSettingsWarning && (
                    <div style={{ backgroundColor: 'rgb(239 68 68)', color: 'white', borderRadius: '10px', padding: '5px 10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: '-150px' }}>
                        Please set your data
                    </div>
                )}
            </div>

            <StartPopup show={modalOpen} onClose={() => setModalOpen(false)} />

            <SettingsPopup show={settingsOpen} onClose={() => setSettingsOpen(false)} setShowSettingsWarning={setShowSettingsWarning} existingRecord={existingRecord} />
            
            <Footer />
        </div>
    );
}
