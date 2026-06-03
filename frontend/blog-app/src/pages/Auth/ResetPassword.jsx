/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import publicAxios from '../../utils/publicAxios';
import { API_PATHS } from '../../utils/apiPaths';

import Logo from '../../assets/react.svg';

import { motion } from "framer-motion";

import { LuArrowLeft } from 'react-icons/lu';
import { FiXCircle } from 'react-icons/fi';
import { MdPassword } from "react-icons/md";

import PassowordField from '../../components/Inputs/PassowordField';
import ConfirmPasswordField from '../../components/Auth/ConfirmPasswordField';

const ResetPassword = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const token = query.get("token");
    const status = query.get("status");

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isInvalid =
        !token ||
        status === "invalid" ||
        status === "error";

    const handleNewPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Por favor ingrese ambos campos");
            return;
        }

        if (password.length < 12) {
            toast.error("La contraseña debe tener al menos 12 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        let toastId;

        try {
            setLoading(true);

            toastId = toast.loading("Guardando nueva contraseña...");

            const response = await publicAxios.post(API_PATHS.AUTH.RESETEAR_PASSWORD(token),
                {
                    password
                }
            );

            toast.success(response.data.message || "Contraseña actualizada", { id: toastId });

            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (error) {
            toast.error(error.response?.data?.message || "Error al guardar la contraseña", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 bg-linear-to-tr from-slate-100 to-gray-200"
        >
            <div className="absolute top-6 left-6">
                <img
                    src={Logo}
                    alt="Logo"
                    className="h-6 md:h-6.5 cursor-pointer"
                    onClick={() => { navigate("/", { replace: true }); }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center"
            >
                <div className="flex justify-start mb-4">
                    <span
                        className="cursor-pointer text-gray-600 hover:text-gray-900 transition"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        <LuArrowLeft size={22} />
                    </span>
                </div>

                {isInvalid ? (
                    <>
                        <FiXCircle size={70} className="text-red-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold mb-2">Token invalido o expirado</h2>
                        <p className="text-gray-600 mb-6">
                            Solicita nuevamente el enlace de recuperación para continuar.
                        </p>
                        <button
                            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl w-full transition"
                            onClick={() => navigate("/forget-password", { replace: true })}
                        >
                            Solicitar nuevo enlace
                        </button>
                    </>
                ) : (
                    <>
                        <MdPassword size={70} className="text-slate-700 mx-auto mb-6" />
                        <h2 className="text-3xl font-semibold mb-2">Nueva contraseña</h2>
                        <p className="text-gray-600 mb-6">Ingresa y confirma tu nueva contraseña</p>

                        <form onSubmit={handleNewPassword}>
                            <PassowordField password={password} setPassword={setPassword} />

                            <ConfirmPasswordField password={password} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading
                                    ? "Guardando..."
                                    : "Guardar nueva contraseña"
                                }
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;