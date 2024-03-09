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
                                Üdvözlünk az oldalunkon! Kérjük, olvasd el az alábbi feltételeket, mielőtt folytatnád az oldal használatát.
                            </p>
                            <p className="text-xl mb-6">
                                Az oldalunk egy teszt- és felmérőoldal, amelynek eredményeit statisztikai elemzésekhez és kutatásokhoz használjuk fel.
                            </p>
                            <p className="text-xl mb-6">
                                A felhasználók kizárólag az oldalunk által meghatározott módon használhatják az oldalt, és tilos a kereskedelmi tevékenység az oldalon.
                            </p>
                            <p className="text-xl mb-6">
                                Fenntartjuk a jogot, hogy bármikor módosítsuk vagy frissítsük a jelen feltételeket. A módosításokról értesítést küldünk, és az új feltételek az értesítés közzétételét követően lépnek életbe.
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
