import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import CurrentPasswordField from './CurrentPasswordField';
import PassowordField from '../../../components/Inputs/PassowordField';
import ConfirmPasswordField from '../../../components/Auth/ConfirmPasswordField';

const PasswordForm = () => {
    const { clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Estados
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (newPassword.length < 12) {
            setError("La nueva contraseña debe tener al menos 12 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }

        if (currentPassword === newPassword) {
            setError("La nueva contraseña debe de ser diferente a la actual");
            return;
        }

        const toastId = toast.loading("Actualizando contraseña...");

        try {
            setIsSubmitting(true);

            const response = await axiosInstance.put(API_PATHS.USUARIOS.PRIVADOS.ACTUALIZAR_PASSWORD,
                {
                    currentPassword,
                    newPassword,
                }
            );

            toast.dismiss(toastId);

            toast.success(response.data.message || "Contraseña actualizada correctamente. Vuelve a iniciar sesión");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            clearUser();
            navigate("/login");
        } catch (error) {
            toast.dismiss(toastId);

            const message = error.response?.data?.message || "Error al cambiar la contraseña";

            setError(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <h2 className="text-lg font-medium text-gray-900">
                    Cambiar contraseña
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Actualiza la contraseña de tu cuenta.
                </p>
            </div>

            <CurrentPasswordField
                password={currentPassword}
                setPassword={setCurrentPassword}
            />

            <PassowordField
                password={newPassword}
                setPassword={setNewPassword}
            />

            <ConfirmPasswordField
                password={newPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
            />

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </button>
        </form>
    );
};

export default PasswordForm;