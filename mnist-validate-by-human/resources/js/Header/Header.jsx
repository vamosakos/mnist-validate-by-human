import React from 'react';
import { Link } from '@inertiajs/react'; // Importáljuk a Link komponenst az Inertia segítségével

export default function Header() {
    return (
        <header style={{ backgroundImage: 'url(/header.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: '0.9', height: '200px' }}>
            <div className="container mx-auto flex justify-center items-center h-full text-white">
                {/* Hozzáadunk egy Link komponenst az About oldalra */}
                <Link href={route('about')} className="text-white">
                    <h1 className="text-7xl font-bold cursor-pointer">MNIST Validation By Human</h1>
                </Link>
            </div>
        </header>
    );
}
