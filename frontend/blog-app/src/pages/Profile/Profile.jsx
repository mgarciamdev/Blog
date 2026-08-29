import React, { useContext } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import ProfilePage from './ProfilePage'
import { UserContext } from '../../context/userContext';

const Profile = () => {
  const { user, loading } = useContext(UserContext);

  return (
    <DashboardLayout>
      <div className="w-full mt-5">
        <h1 className="text-2xl font-semibold mb-5">
          Perfil de Usuario
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50 mt-3">
          {loading ? (
            <p className="text-gray-500">Cargando perfil....</p>
          ) : !user ? (
            <p className="text-gray-500">Es necesario iniciar sesión para visualizar tu perfil.</p>
          ) : (
            <ProfilePage />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;