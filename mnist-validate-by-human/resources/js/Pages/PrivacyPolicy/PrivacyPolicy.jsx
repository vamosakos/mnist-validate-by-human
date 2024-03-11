import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';

export default function PrivacyPolicy() {
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
                            <Head title="Privacy Policy" />
                            <p className="text-4xl font-bold mb-6">Privacy Policy</p>
                            <p className="text-xl mb-6">
                                Welcome to our website! Below you will find our privacy practices, which include details on data collection, handling, and protection. Please read this document carefully to understand what data we collect and how we manage it.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>1. Collected Data</strong><br/>
                                We use three main types of cookies when visiting our website: XSRF-TOKEN, laravel_session, and UUID. These cookies help maintain the security and functionality of the site.
                                <br/><br/>
                                <strong>XSRF-TOKEN:</strong> This cookie helps protect the website against Cross-Site Request Forgery (CSRF) attacks.
                                <br/><br/>
                                <strong>laravel_session:</strong> This cookie stores information collected during your current visit. Its validity extends for one year and is essential for the security and functionality of the site.
                                <br/><br/>
                                <strong>UUID:</strong> We generate a temporary unique identifier for each visitor when filling out surveys. The temporary UUID helps ensure that guests do not receive the same image multiple times. Temporary UUIDs are deleted within an hour at the end of the visit.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>2. Purpose of Data Processing</strong><br/>
                                The data we collect is used solely to improve the security and functionality of the website. We do not sell or share any personal data with third parties.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>3. Cookie Management</strong><br/>
                                Cookies can generally be managed in your browser settings. However, please note that disabling or deleting cookies may affect the functionality and security of the site.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>4. Acceptance</strong><br/>
                                By using our site and accepting cookies, you consent to the data processing practices described by us.
                            </p>
                            <p className="text-xl mb-6">
                                This privacy policy took effect on March 8, 2024, and we reserve the right to make modifications if deemed necessary.
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
