import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForwardFast } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ auth }) => {
    const [activeFunction, setActiveFunction] = useState('');

    useEffect(() => {
        const storedActiveFunction = localStorage.getItem('activeFunction');
        if (storedActiveFunction) {
            setActiveFunction(storedActiveFunction);
        }
    }, []);

    const handleChange = (selectedFunction) => {
        setActiveFunction(selectedFunction);
        localStorage.setItem('activeFunction', selectedFunction);

        axios.post('/api/set-image-generation', { function_name: selectedFunction })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error.response.data);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Generation Manipulation</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-5 gap-4">
                                <div>
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateRandomImage' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => handleChange('generateRandomImage')}>Random</button>
                                </div>
                                <div>
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateFrequencyWeightedImage' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => handleChange('generateFrequencyWeightedImage')}>Balancing</button>
                                </div>
                                <div>
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateMisidentificationWeightedImage' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => handleChange('generateMisidentificationWeightedImage')}>Most Often Misidentified</button>
                                </div>
                                <div>
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateRandomTrainImage' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => handleChange('generateRandomTrainImage')}>Train Images</button>
                                </div>
                                <div>
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateRandomTestImage' ? 'bg-blue-500 text-white' : 'bg-white'}`} onClick={() => handleChange('generateRandomTestImage')}>Test Images</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-4 mt-4">
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p>Selects randomly from the entire dataset (70,000 images).</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faForwardFast} size="lg" style={{ color: '#FFA500' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p>Selects randomly from the least generated images based on the weights of previously generated images. Users won't receive the same image twice within an hour.</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faForwardFast} size="lg" style={{ color: '#FF0000' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p>Selects randomly from the images that were most often misidentified based on their weights. Users won't receive the same image twice within an hour.</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faForwardFast} size="lg" style={{ color: '#ADFF2F' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p>Selects randomly from the Training dataset (60,000 images).</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faForwardFast} size="lg" style={{ color: '#FFD700' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p>Selects randomly from the Test dataset (10,000 images).</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faForwardFast} size="lg" style={{ color: '#008000' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Dashboard;
