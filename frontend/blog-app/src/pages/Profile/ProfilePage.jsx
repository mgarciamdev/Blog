import React, { useContext } from 'react'
import ProfileInfoForm from './components/ProfileInfoForm';
import { UserContext } from '../../context/userContext';
import UsernameForm from './components/UsernameForm';
import PasswordForm from './components/PasswordForm';
import DeleteAccountSection from './components/DeleteAccountSection';

const ProfilePage = () => {
    const { user } = useContext(UserContext);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200">
                <ProfileInfoForm user={user} />
            </div>
            <div className="col-span-5 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200">
                <UsernameForm user={user} />

                <div className="my-6 border-t border-gray-200" />

                <PasswordForm />
            </div>

            {/* ZONA PELIGROSA */}
            <div className="col-span-5 md:col-span-3 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg shadow-gray-100 border border-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-red-200">
                <DeleteAccountSection />
            </div>
        </div>
    );
};

export default ProfilePage;