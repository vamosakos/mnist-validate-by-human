import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, Head } from '@inertiajs/react';

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

        <PrimaryButton>
            <Link
                href={route('test')}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
            >
                Take the test
            </Link>
        </PrimaryButton>
        </GuestLayout>
        
    );
}