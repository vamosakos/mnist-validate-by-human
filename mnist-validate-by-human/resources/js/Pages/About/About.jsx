import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import StartPopup from '@/Popups/TakeTheTestPopup';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';
import SettingsPopup from '@/Popups/GuestSettingsPopup'; // Importáljuk a SettingsPopup komponenst
import axios from 'axios'; // Importáljuk az Axios modult

export default function About() {
    const [modalOpen, setModalOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false); // Állítsuk be az állapotot a beállítások megnyitásához
    const [identificationsCount, setIdentificationsCount] = useState(0);
    const [showSettingsWarning, setShowSettingsWarning] = useState(false); // Állítsuk be az állapotot a figyelmeztetés megjelenítéséhez
    const [existingRecord, setExistingRecord] = useState(null); // Adjunk hozzá egy állapotot az existingRecord-nek

    useEffect(() => {
        // Fetch identifications count initially
        fetchIdentificationsCountFromDatabase();
    
        // Check session in guest settings only when settings popup is closed
        if (!settingsOpen) {
            checkSession();
        }
    }, [settingsOpen]);

    const fetchIdentificationsCountFromDatabase = async () => {
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
            // Állítsuk be az existingRecord állapotot a válasz alapján
            if (response.data.exists) {
                setExistingRecord(response.data.record);
            }
        } catch (error) {
            console.error('Error checking session in guest settings:', error);
        }
    };

    return (
        <div>
            {/* Header */}
            <Header />

            {/* Main Content and Button Container */}
            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                {/* Main Content */}
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    {/* Image */}
                    <div className="w-full md:w-1/3 mb-2 md:mb-0">
                        <img src="/content-img.png" alt="Content" className="w-80 h-80 rounded-3xl" />
                    </div>
                    
                    {/* Text and Read more button */}
                    <div className="w-full md:w-2/3 md:pl-6 flex flex-col justify-between text-left">
                        <div>
                            <Head title="About" />
                            {/* Highlighted and enlarged text */}
                            <p className="text-4xl font-bold mb-6">What is this?</p>
                            {/* Regular text */}
                            <p className="text-xl mb-6">MNIST is a dataset consisting of handwritten digits. It is commonly used for training various image processing systems. The images in MNIST are grayscale and 28x28 pixels in size. This dataset is widely used for training and testing in the field of machine learning and computer vision.</p>
                            {/* Additional text */}
                            <p className="text-xl mb-6">This site contains a test/survey where you need to decide what number you see, selecting from a total of 70,000 images using the entire MNIST database.</p>
                            {/* Additional text for clarification */}
                            <p className="text-xl mb-6">The website is developed as part of a thesis project, aiming to collect human responses for MNIST images. Your responses will be used for statistical analysis and research purposes.</p>
                        </div>
                        
                        {/* Read more button */}
                        <div className="flex justify-end">
                            <a href="https://en.wikipedia.org/wiki/MNIST_database" target="_blank" rel="noopener noreferrer" className="text-lg bg-gray-43 text-white rounded-full py-2 px-8 hover:bg-gray-127">
                                Read more
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Button */}
                <div className="bg-gray-127">
                    <button
                        className="text-xl bg-green-custom text-white rounded-full py-3 px-14 hover:bg-emerald-600"
                        onClick={() => setModalOpen(true)}
                    >
                        Take the test
                    </button>
                </div>

                {/* Identifications Counter */}
                <div className="text-4xl text-black mt-24 text-center number-animation">
                    A total of <span className="font-bold">{identificationsCount}</span> images identified so far
                </div>
            </div>

            {/* Settings Icon and Warning Bubble */}
            <div 
                style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1000', display: 'flex', alignItems: 'center' }} 
                onClick={() => setSettingsOpen(true)} // Megnyitjuk a beállításokat, ha az ikonra kattintanak
                className='number-animation'
            >
                <div style={{ backgroundColor: '#333', borderRadius: '50%', padding: '15px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
                    <FontAwesomeIcon icon={faGears} style={{ color: '#ffffff', fontSize: '24px' }} />
                </div>
                
                {showSettingsWarning && (
                    <div style={{ backgroundColor: 'red', color: 'white', borderRadius: '10px', padding: '5px 10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: '-150px' }}>
                        Please set your data
                    </div>
                )}
            </div>

            {/* Exit confirmation modal */}
            <StartPopup show={modalOpen} onClose={() => setModalOpen(false)} />

            {/* Settings Popup */}
            <SettingsPopup show={settingsOpen} onClose={() => setSettingsOpen(false)} setShowSettingsWarning={setShowSettingsWarning} existingRecord={existingRecord} /> 
            {/* Adjuk hozzá a SettingsPopup komponenst a megjelenítéshez */}
            
            <Footer />
        </div>
    );
}
