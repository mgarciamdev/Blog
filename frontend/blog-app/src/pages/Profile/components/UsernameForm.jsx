import React, { useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import publicAxios from '../../../utils/publicAxios';
import { API_PATHS } from '../../../utils/apiPaths';
import UsernameField from '../../../components/Inputs/UsernameField';
import toast from 'react-hot-toast';
import axiosInstance from '../../../utils/axiosInstance';
import { UserContext } from '../../../context/userContext';

const UsernameForm = ({ user }) => {
    const { updateUserProfile } = useContext(UserContext);

    const [username, setUsername] = useState(user?.username || "");
    const [suggestions, setSuggestions] = useState([]);
    const [debounceUsername, setDebounceUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remainingDays, setRemainingDays] = useState(null);

    useEffect(() => {
        if (!user) return;

        setUsername(user.username || "");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (isSubmitting) return;
        setRemainingDays(null);

        const normalized = username.trim().toLowerCase();

        const toastId = toast.loading("Actualizando username...");

        try {

            setIsSubmitting(true);

            const response = await axiosInstance.put(
                API_PATHS.USUARIOS.PRIVADOS.ACTUALIZAR_USERNAME,
                { username: normalized }
            );

            updateUserProfile(response.data);

            setUsername(response.data.user?.username || normalized);

            setSuggestions([]);

            toast.dismiss(toastId);
            toast.success(response.data.message || "Username actualizado correctamente");

        } catch (err) {
            toast.dismiss(toastId);

            const days = err.response?.data?.remainingDays ?? null;

            setRemainingDays(days);

        } finally {
            setIsSubmitting(false);
        }
    };

    const checkUsername = async (value) => {
        try {
            const response = await publicAxios.get(API_PATHS.USUARIOS.PUBLICOS.VERIFICAR_USERNAME,
                {
                    params: { username: value },
                }
            );

            if (response.data.available) {

                setSuggestions([]);
            } else {

                setSuggestions(response.data.suggestions || []);
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceUsername(username);
        }, 1500);

        return () => clearTimeout(timer);
    }, [username]);

    useEffect(() => {
        if (debounceUsername.trim().length <= 2) return;

        checkUsername(debounceUsername);
    }, [debounceUsername]);

    useEffect(() => {
        if (remainingDays === null) return;

        const timer = setTimeout(() => {
            setRemainingDays(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [remainingDays]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4"        >

            <UsernameField
                username={username}
                setUsername={setUsername}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
            />

            <AnimatePresence>
                {remainingDays !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3"
                    >
                        <p className="text-sm font-medium text-amber-800">
                            Aún no puedes cambiar tu nombre de usuario.
                        </p>

                        <p className="mt-1 text-sm text-amber-700">
                            Podrás volver a cambiarlo dentro de{" "}
                            <span className="font-semibold">
                                {remainingDays}{" "}
                                {remainingDays === 1 ? "día" : "días"}
                            </span>.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
            >
                {isSubmitting ? "Actualizando..." : "Actualizar username"}
            </button>



        </form>
    );
};

export default UsernameForm;