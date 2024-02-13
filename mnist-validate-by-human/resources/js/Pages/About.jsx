import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function About({ }) {
    return (
        <GuestLayout>
        <Head title="About" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">MNIST Human Validation</div>
                </div>
            </div>
        </div>
        </GuestLayout>
    );
}