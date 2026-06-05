/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import publicAxios from '../../utils/publicAxios';
import { API_PATHS } from '../../utils/apiPaths';
import { motion } from "framer-motion";
import { FaCheckCircle } from 'react-icons/fa';
import { FiXCircle } from 'react-icons/fi';
import { FaArrowLeftLong } from 'react-icons/fa6';
import AuthInput from '../../components/Inputs/AuthInput';
import Logo from '../../assets/react.svg';

const Verify = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const status = query.get("status");

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "success") {
            const timer = setTimeout(() => {
                navigate("/login", { replace: true });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [status, navigate]);

    const handleResend = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Por favor ingresa tu email");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Por favor ingresa un email válido");
            return;
        }

        let toastId;

        try {
            setLoading(true);

            toastId = toast.loading("Reenviando correo de verificación...");

            await publicAxios.post(API_PATHS.AUTH.REINTENTAR_VERIFICACION, { email });

            toast.success("Si existe una cuenta pendiente de verificación, recibirás un nuevo enlace.", { id: toastId });

            setEmail("");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2500);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "No se pudo procesar la solicitud",
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen p-4 
            ${status === "success"
                ? "bg-linear-to-tr from-emerald-100 to-green-200"
                : "bg-linear-to-tr from-red-100 to-orange-100"
            }`}
        >
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <img
                    src={Logo}
                    alt="Logo"
                    className="h-6 md:h-6.5"
                    onClick={() => { navigate("/", { replace: true }); }}
                />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-md text-center"
            >
                <div className="flex justify-start mb-4">
                    <span
                        className="cursor-pointer text-gray-400 hover:text-black"
                        onClick={() => navigate("/login", { replace: true })}
                    >
                        <FaArrowLeftLong size={20} />
                    </span>
                </div>
                {status === "success" ? (
                    <>
                        <FaCheckCircle className="text-green-500 text-5xl md:text-6xl mx-auto mb-6" />
                        <h1 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
                            ¡Cuenta verificada!
                        </h1>

                        <p className="text-sm md:text-base text-gray-600 mb-6">
                            Tu correo ha sido verificado correctamente.
                            Ahora puedes iniciar sesión y acceder a todas las funciones de la plataforma.
                        </p>

                        <p className="text-gray-500 text-sm mb-6">
                            Serás redirigido al inicio de sesión en unos segundos...
                        </p>

                        <button
                            onClick={() => navigate("/login", { replace: true })}
                            className="w-full py-3 rounded-xl text-sm md:text-base bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                        >
                            Ir a iniciar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <FiXCircle className="text-red-500 text-6xl mx-auto mb-6" />

                        <h1 className="text-2xl font-bold mb-2 text-gray-800">
                            Token inválido o expirado
                        </h1>

                        <p className="text-gray-600 mb-6">
                            Ingresa tu email para reenviar el enlace de verificación:
                        </p>

                        <form onSubmit={handleResend}>
                            <div className="mb-4">
                                <AuthInput
                                    type="email"
                                    placeholder="Tu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading
                                    ? "Enviando..."
                                    : "Reenviar email"
                                }
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Verify;