import React from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import UsersDataTable from './components/UsersDataTable';

const Users = () => {

    return (
        <DashboardLayout>
            <div className="w-full mt-5">
                <h2 className="text-2xl font-semibold mb-5">
                    Manejo de Usuarios
                </h2>
                <p className="text-md text-gray-500 mb-2">
                    Gestión de miembros y personal administrativo
                </p>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50 mt-3">
                    <UsersDataTable />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Users;