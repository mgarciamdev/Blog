import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal';
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import publicAxios from '../../../utils/publicAxios';
import { API_PATHS } from '../../../utils/apiPaths';
import PassowordField from '../../../components/Inputs/PassowordField';
import UsernameField from '../../../components/Inputs/UsernameField';
import toast from 'react-hot-toast';
import uploadImage from '../../../utils/uploadImage';
import axiosInstance from '../../../utils/axiosInstance';
import { validateEmail } from '../../../utils/helper';
import AuthInput from '../../../components/Inputs/AuthInput';

const CreateUserForm = ({ isOpen, onClose, onUserCreated }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [debounceUsername, setDebounceUsername] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();

        setLoading(true);

        const toastId = toast.loading("Creando usuario....");

        try {
            let profileImageUrl = "";

            if (!fullName) {
                throw new Error("Porfavor ingrese su nombre completo");
            }

            if (!validateEmail(email)) {
                throw new Error("Por favor ingrese un correo electronico valido");
            }

            if (password.length < 12) {
                throw new Error("La contraseña debe tener mínimo 12 caracteres");
            }

            if (image) {
                const response = await uploadImage(image);
                profileImageUrl = response.imageUrl || profileImageUrl;
            }

            if (removeImage && !image) {
                profileImageUrl = "";
            }

            const response = await axiosInstance.post(API_PATHS.SUPERADMIN.CREAR, {
                name: fullName,
                username,
                email,
                password,
                profileImageUrl,
                bio
            });

            if (onUserCreated) {
                onUserCreated();
            }

            toast.success(response.data.message || "Registro exitoso1", { id: toastId });

            setFullName("");
            setEmail("");
            setPassword("");
            setBio("");
            setUsername("");
            setImage(null);
            setPreview(null);
            setRemoveImage(false);
            setUsernameError(null);
            setSuggestions([]);

            onClose();

        } catch (error) {
            toast.error(error?.response?.message || "Error al crear nuevo usuario", { id: toastId });
        } finally {
            setLoading(false);
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
                setUsernameError(null);
                setSuggestions([]);
            } else {
                setUsernameError(response.data.message);
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

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Crear nuevo Administrador"
            >
                <form onSubmit={handleCreate} className="space-y-6 p-6 w-180">
                    <p className="text-xs text-gray-500">Completa la información para registrar un nuevo administrador del sistema.</p>

                    <h3 className="text-xs text-gray-500 font-semibold">Agregar Imagen</h3>
                    <ProfilePhotoSelector
                        image={image}
                        setImage={setImage}
                        preview={preview}
                        setPreview={setPreview}
                        onRemove={() => {
                            setImage(null);
                            setPreview(null);
                            setRemoveImage(true);
                        }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <AuthInput
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label="Nombre completo"
                            placeholder="Nombre completo"
                            type="text"
                        />

                        <AuthInput
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label="Email"
                            placeholder="Correo Electronico"
                            type="text"
                        />

                        <PassowordField password={password} setPassword={setPassword} />

                        <UsernameField
                            username={username}
                            setUsername={setUsername}
                            usernameError={usernameError}
                            setUsernameError={setUsernameError}
                            suggestions={suggestions}
                            setSuggestions={setSuggestions}
                        />
                    </div>

                    <label className="block font-medium mb-1 text-[13px] text-slate-800">Biografia</label>
                    <textarea
                        name="bio"
                        placeholder="Cuentanos sobre ti"
                        onChange={({ target }) => setBio(target.value)}
                        className="input-box w-full h-32 bg-transparent outline-lime-50 resize-none"
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary flex items-center justify-center gap-2 transition-all duration-300 
                                ${loading
                                    ? "scale-95 opacity-80 cursor-not-allowed"
                                    : "hover:scale-105"
                                }
                            `}
                        >
                            {loading ? "Creando..." : "Crear Administrador"}
                        </button>
                    </div>

                </form>
            </Modal>
        </div>
    );
};

export default CreateUserForm