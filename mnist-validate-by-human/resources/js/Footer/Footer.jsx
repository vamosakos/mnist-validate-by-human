import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-43 py-4 text-white text-center">
            <p>&copy; 2024 MNIST Validation By Human</p>
            <p style={{ fontSize: 'x-small' }}>Developed by Vámos Ákos János and Vámos Márton István</p>
            <div className="flex justify-center">
                <Link href={route('privacy-policy')} className="text-white mr-1" style={{ fontSize: 'x-small' }}>Privacy Policy</Link>
                <span className="text-white mr-1" style={{ fontSize: 'x-small' }}>•</span>
                <Link href={route('terms-of-service')} className="text-white" style={{ fontSize: 'x-small' }}>Terms of Service</Link>
            </div>
        </footer>
    );
}
