import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserContext } from '../../../context/userContext';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import Modal from '../../../components/Modal';
import CurrentPasswordField from './CurrentPasswordField';

const DeleteAccountSection = () => {
    const { clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        if (isSubmitting) return; // no cerrar mientras se envía
        setIsOpen(false);
        setPassword("");
        setError("");
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");

        if (!password) {
            setError("Ingresa tu contraseña para confirmar");
            return;
        }

        const toastId = toast.loading("Eliminando cuenta...");

        try {
            setIsSubmitting(true);

            // En DELETE, axios manda el body dentro de "data"
            const response = await axiosInstance.delete(
                API_PATHS.USUARIOS.PRIVADOS.ELIMINAR_CUENTA,
                { data: { password } }
            );

            toast.dismiss(toastId);
            toast.success(response.data.message || "Cuenta eliminada correctamente");

            clearUser();
            navigate("/", { replace: true });

        } catch (error) {
            toast.dismiss(toastId);

            const message = error.response?.data?.message || "Error al eliminar la cuenta";

            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col h-full">
            <div>
                <h2 className="text-lg font-medium text-red-600">
                    Eliminar cuenta
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Tu cuenta se desactivará y cerraremos tu sesión. Tendrás 30 días para
                    reactivarla iniciando sesión con tu correo y contraseña; pasado ese
                    tiempo se eliminará de forma definitiva.
                </p>
            </div>
            <div className="ml-auto mt-auto pt-auto">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                    Eliminar mi cuenta
                </button>
            </div>


            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Confirmar eliminación de cuenta"
            >
                <form onSubmit={handleDelete} className="space-y-4 p-6">
                    <p className="text-sm text-gray-600">
                        Para confirmar, ingresa tu contraseña. Esta acción cerrará tu sesión
                        en todos los dispositivos.
                    </p>

                    <CurrentPasswordField
                        password={password}
                        setPassword={setPassword}
                    />

                    {error && (
                        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Eliminando..." : "Eliminar cuenta"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DeleteAccountSection;