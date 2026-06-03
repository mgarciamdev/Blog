/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import publicAxios from '../../utils/publicAxios';
import { API_PATHS } from '../../utils/apiPaths';
import { motion } from 'framer-motion';
import Logo from '../../assets/react.svg';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { LuMail } from 'react-icons/lu';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRecover = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Por favor ingresa tu email");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Por favor ingresa un email válido")
            return;
        }

        try {
            setLoading(true);

            const toastId = toast.loading("Enviando mensaje de recuperación");

            await publicAxios.post(API_PATHS.AUTH.RECUPERAR_PASSWORD, { email });

            toast.success("Si existe una cuenta asociada a este correo, recibirás instrucciones para restablecer tu contraseña.", { id: toastId });

            setEmail("");

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo procesar la solicitud");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-400">
            {/* Logo arriba a la izquierda */}
            <div className="absolute top-6 left-6">
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
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='bg-white/50 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center'
            >
                {/* Back button */}
                <div className="flex justify-start mb-4">
                    <span
                        className="cursor-pointer text-gray-800 hover:text-gray-800"
                        onClick={() => navigate("/login", { replace: true })}
                    >
                        <FaArrowLeftLong size={20} />
                    </span>
                </div>

                {/* Icon */}
                <LuMail size={70} className='text-gray-500 mx-auto mb-6' />

                {/* Title */}
                <h1 className="text-2xl font-bold mb-2">¿Olvidaste la contraseña?</h1>
                <p className="text-gray-700 mb-6 text-sm">
                    Ingresa tu correo y te enviaremos un enlace para restablecerla.
                </p>

                <form onSubmit={handleRecover}>
                    {/* Input */}
                    <input
                        type="email"
                        placeholder='Ingresa tu email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='mb-4 px-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-gray-200'
                        autoFocus
                        autoComplete='email'
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl w-full disabled:opacity-50 transition"
                    >
                        {loading ? "Enviarndo...." : "Solicitar nueva contrasena"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-emerald-800">
                    ¿Ya tienes cuenta?{" "}
                    <span
                        onClick={() => navigate("/login", { replace: true })}
                        className="text-emerald-800 cursor-pointer hover:underline"
                    >
                        Inicia sesión
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;