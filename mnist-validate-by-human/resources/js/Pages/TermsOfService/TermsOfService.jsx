import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';

export default function TermsOfService() {
    return (
        <div>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    {/* Text */}
                    <div className="w-full text-left">
                        <div>
                            <Head title="Terms of Service" />
                            <p className="text-4xl font-bold mb-6">Terms of Service</p>
                            <p className="text-xl mb-6">
                                Welcome to our website! Please read the following terms before continuing to use the site.
                            </p>
                            <p className="text-xl mb-6">
                                Our website is a testing and survey platform, and the results obtained are used for statistical analysis and research purposes.
                            </p>
                            <p className="text-xl mb-6">
                                Visitors may only use the website in the manner specified by us, and any commercial or unethical activities are prohibited.
                            </p>
                            <p className="text-xl mb-6">
                                We reserve the right to modify or update these terms at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
