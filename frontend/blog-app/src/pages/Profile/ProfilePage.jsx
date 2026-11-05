import React, { useContext } from 'react'
import ProfileInfoForm from './components/ProfileInfoForm';
import { UserContext } from '../../context/userContext';
import UsernameForm from './components/UsernameForm';
import PasswordForm from './components/PasswordForm';
import DeleteAccountSection from './components/DeleteAccountSection';

const ProfilePage = () => {
    const { user } = useContext(UserContext);

    if (!user) return null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 my-4 md:my-6 items-stretch">

            {/* DATOS PERSONALES DEL USUARIO */}
            <section className="min-w-0 xl:col-span-6 bg-white p-5 md:p-6 rounded-2xl shadow-sm transition-all border border-gray-200/70 duration-300 hover:shadow-md hover:border-sky-200">
                <ProfileInfoForm user={user} />
            </section>

            {/* CONFIGURACIÓN */}
            <div className="xl:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

                {/* CAMBIO DE CONTRASEÑA */}
                <section className="min-w-0 xl:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm transition-all border border-gray-200/70 duration-300 hover:shadow-md hover:border-emerald-200">
                    <PasswordForm />
                </section>

                {/* CAMBIO DE USUARIO */}
                <section className="min-w-0 xl:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm transition-all border border-gray-200/70 duration-300 hover:shadow-md hover:border-emerald-200">
                    <UsernameForm user={user} />
                </section>
            </div>

            {/* ZONA PELIGROSA */}
            <section className="min-w-0 xl:col-span-12 bg-white p-5 md:p-6 rounded-2xl shadow-sm transition-all border border-gray-200/70 duration-300 hover:shadow-md hover:border-red-200">
                <DeleteAccountSection />
            </section>
        </div>
    );
};

export default ProfilePage;