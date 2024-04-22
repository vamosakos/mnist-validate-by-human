import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Checkbox from '@/Components/Checkbox';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';

const ImageGenerationSettings = ({ auth }) => {
    const [activeFunction, setActiveFunction] = useState('');
    const [trainActive, setTrainActive] = useState(true);
    const [testActive, setTestActive] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        axios.get('/api/get-active-image-generation')
            .then(response => {
                const { activeFunction, train, test } = response.data;
                setActiveFunction(activeFunction);
                setTrainActive(train === 1);
                setTestActive(test === 1);
            })
            .catch(error => {
                console.error('Error:', error.response.data);
            });
    }, []);

    const handleChange = (selectedFunction) => {
        setActiveFunction(selectedFunction);
        localStorage.setItem('activeFunction', selectedFunction);
        setClicked(true);
    };

    const handleTrainClick = () => {
        setTrainActive(!trainActive);
        setClicked(true);
    };
    
    const handleTestClick = () => {
        setTestActive(!testActive);
        setClicked(true);
    };

    const handleSaveClick = () => {
        let newTrainActive = trainActive;
        let newTestActive = testActive;
        
        if (!trainActive && !testActive) {
            newTrainActive = true;
            newTestActive = true;
        }

        axios.post('/api/set-image-generation', {
            function_name: activeFunction,
            train: newTrainActive ? 1 : 0,
            test: newTestActive ? 1 : 0
        })
        .then(response => {
            console.log(response.data);
            setTrainActive(newTrainActive);
            setTestActive(newTestActive);
            setActiveFunction(activeFunction);
            setSuccessMessage('Settings saved successfully.');
            setClicked(false);
        })
        .catch(error => {
            console.error('Error:', error.response.data);
        });
    };

    useEffect(() => {
        if (clicked) {
            setSuccessMessage('');
        }
    }, [clicked]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Generation Settings</h2>}
        >
            <Head title="Image Generation Settings" />
    
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-1">
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateRandomImage' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-slate-200'}`} onClick={() => handleChange('generateRandomImage')}>
                                        Random
                                    </button>
                                </div>
                                <div className="sm:col-span-1">
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateFrequencyWeightedImage' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-slate-200'}`} onClick={() => handleChange('generateFrequencyWeightedImage')}>
                                        Balancing
                                    </button>
                                </div>
                                <div className="sm:col-span-1">
                                    <button className={`border rounded-lg p-2 w-full ${activeFunction === 'generateMisidentificationWeightedImage' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white hover:bg-slate-200'}`} onClick={() => handleChange('generateMisidentificationWeightedImage')}>
                                        Most Often Misidentified
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p style={{ textAlign: 'justify' }}>Selects completely randomly. Image weighting is ignored.</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p style={{ textAlign: 'justify' }}>Selects randomly from the least generated images based on the weights of previously generated images. Users won't receive the same image twice within an hour.</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-2 rounded-lg relative">
                                    <p style={{ textAlign: 'justify' }}>Selects randomly from the images that were most often misidentified based on their weights. Users won't receive the same image twice within an hour.</p>
                                    <div className="absolute right-0 bottom-0 flex items-center">
                                        <strong>Speed: </strong>
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} />
                                        <FontAwesomeIcon icon={faCircleHalfStroke} style={{ color: '#3b82f6' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <Checkbox
                                    className="mr-2 cursor-pointer"
                                    checked={trainActive}
                                    onChange={handleTrainClick}
                                />
                                <label className="cursor-pointer">From Train dataset</label>
                                <Checkbox
                                    className="ml-4 mr-2 cursor-pointer"
                                    checked={testActive}
                                    onChange={handleTestClick}
                                />
                                <label className="cursor-pointer">From Test dataset</label>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="ml-4 border rounded-lg p-2 bg-blue-500 text-white hover:bg-blue-600"  style={{ width: '200px' }} onClick={handleSaveClick}>
                                    Save
                                </button>
                            </div>
                            <div className="flex justify-center mt-4">
                                {successMessage && (
                                    <div className="text-center mt-4 text-blue-500">{successMessage}</div>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <p style={{ fontStyle: 'italic' }}>More <FontAwesomeIcon icon={faCircle} style={{ color: '#3b82f6' }} /> = Faster</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );    
};

export default ImageGenerationSettings;
