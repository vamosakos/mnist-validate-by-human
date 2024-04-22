import React from 'react';
import { Head } from '@inertiajs/react';
import Footer from '@/Footer/Footer';
import Header from '@/Header/Header';

export default function PrivacyPolicy() {
    return (
        <div>
            <Header />

            <div className="bg-gray-127 min-h-screen flex flex-col justify-center items-center py-">
                <div className="container mx-auto bg-gray-194 rounded-lg p-12 text-center mb-6 flex flex-wrap">
                    <div className="w-full text-left">
                        <div>
                            <Head title="Privacy Policy" />
                            <p className="text-4xl font-bold mb-6">Privacy Policy</p>
                            <p className="text-xl mb-6">
                                Welcome to our website! Below you will find our Privacy Policy, which provides details of our data collection, handling and protection practices. Please read this document carefully to understand what information we collect and how we use it.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>1. Collected Data</strong><br/>
                                    We use three main types of cookies when you visit our website: XSRF-TOKEN, laravel_session and X-Client-Token & UUId. These cookies help maintain the security and functionality of the site.
                                <br/><br/>
                                <strong>XSRF-Token:</strong> This cookie helps to protect the site from Cross-Site Request Forgery (CSRF) attacks.
                                <br/><br/>
                                <strong>laravel_session:</strong> This cookie stores information collected during your current visit. Its validity lasts for one year and is essential for the security and functionality of the site.
                                <br/><br/>
                                <strong>X-Client-Token & UUId:</strong> A unique identifier is generated for each visitor when completing surveys. This ensures that visitors do not receive the same image more than once within a given time. These identifiers can be deleted at any time in the browser settings.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>2. Purpose of Data Processing</strong><br/>
                                    The data collected is solely used to enhance the website's security and functionality. We do not share or sell any personal data with third parties.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>3. Cookie Management</strong><br/>
                                    You can usually manage cookies in your browser settings. However, keep in mind that disabling or deleting cookies may impact the site's functionality and security.
                            </p>
                            <p className="text-xl mb-6">
                                <strong>4. Acceptance</strong><br/>
                                By using our site, you agree to our data processing practices.
                            </p>
                            <p className="text-xl mb-6">
                                The privacy policy was last updated on April 09, 2024 and may be modified if necessary.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
