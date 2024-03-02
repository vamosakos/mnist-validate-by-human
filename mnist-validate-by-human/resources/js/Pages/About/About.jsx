import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StartPopup from '@/Popups/TakeTheTestPopup';
import Footer from '@/Footer/Footer';

export default function About() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            {/* Header */}
            <header style={{ backgroundImage: 'url(/header.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9', height: '200px' }}>
                <div className="container mx-auto flex justify-center items-center h-full text-white">
                    <h1 className="text-7xl font-bold">MNIST Validation By Human</h1>
                </div>
            </header>

            {/* Main Content and Button Container */}
            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                {/* Main Content */}
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    {/* Image */}
                    <div className="w-full md:w-1/3 mb-2 md:mb-0">
                        <img src="/content-img.png" alt="Content" className="w-80 h-80 rounded-3xl" />
                    </div>
                    
                    {/* Text and Read more button */}
                    <div className="w-full md:w-2/3 md:pl-6 flex flex-col justify-between">
                        <div>
                            <Head title="About" />
                            {/* Highlighted and enlarged text */}
                            <p className="text-3xl font-bold mb-6">What is this?</p>
                            {/* Regular text */}
                            <p className="text-lg mb-6">MNIST is a dataset consisting of handwritten digits. It is commonly used for training various image processing systems. The images in MNIST are grayscale and 28x28 pixels in size. This dataset is widely used for training and testing in the field of machine learning and computer vision.</p>
                            {/* Additional text for clarification */}
                            <p className="text-lg mb-6">This website is developed as part of a thesis project, aiming to collect human responses for MNIST images. Your responses will be used for statistical analysis and research purposes.</p>
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
            </div>

            {/* Exit confirmation modal */}
            <StartPopup show={modalOpen} onClose={() => setModalOpen(false)} />

            <Footer />
        </div>
    );
}
