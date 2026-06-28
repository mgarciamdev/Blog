import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal'
import uploadImage from '../../../utils/uploadImage';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import toast from 'react-hot-toast';
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';

const EditUserForm = ({ user, isOpen, onUserUpdated, onClose }) => {
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(user?.profileImageUrl || "");
    const [loading, setLoading] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);

    useEffect(() => {
        if (!user) return;

        setProfileData({
            name: user.name || "",
            bio: user.bio || "",
        });

        setPreview(user.profileImageUrl || "");
        setImage(null);
        setRemoveImage(false);

    }, [user]);

    const handleChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?._id) return;

        setLoading(true);

        const toastId = toast.loading("Actualizando usuario....");

        try {
            let profileImageUrl = user.profileImageUrl;

            if (image) {
                const response = await uploadImage(image);
                profileImageUrl = response.imageUrl || profileImageUrl;
            }

            if (removeImage && !image) {
                profileImageUrl = "";
            }

            await axiosInstance.put(API_PATHS.ADMIN.ACTUALIZAR_PERFIL_USUARIO(user._id),
                {
                    ...profileData,
                    profileImageUrl,
                }
            );

            if (onUserUpdated) {
                onUserUpdated();
            }

            toast.success("Actualización exitosa", { id: toastId });

            setImage(null);
            setRemoveImage(false);

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Error al actualizar usuario",
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Editar Usuario"
            >
                <form onSubmit={handleSubmit} className="space-y-4 p-6 w-100">

                    <h3 className="text-xs text-gray-500 font-semibold">Editar Imagen</h3>
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

                    <label className="block font-medium mb-1 text-[13px] text-slate-800">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={profileData.name}
                        onChange={handleChange}
                        className="input-box w-full bg-transparent outline-lime-50"
                    />

                    <label className="block font-medium mb-1 text-[13px] text-slate-800">Biografia</label>
                    <textarea
                        name="bio"
                        placeholder="Cuentanos sobre ti"
                        value={profileData.bio}
                        onChange={handleChange}
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
                            {loading ? "Guardando..." : "Guardando cambios"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EditUserForm;