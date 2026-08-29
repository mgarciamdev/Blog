import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/userContext';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import PhotoCriteria from './PhotoCriteria';

const ProfileInfoForm = ({ user }) => {
    const { updateUserProfile } = useContext(UserContext);

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!user) return;

        setName(user.name || "");
        setBio(user.bio || "");
        setPreview(user.profileImageUrl || "");

    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const toastId = toast.loading("Actualizando usuario....");

        if (name.length > 50) {
            setError("El nombre no puede exeder 50 caracteres");
            toast.dismiss(toastId);
            return;
        }

        if (bio.length > 200) {
            setError("La biografia no puede exceder 200 caracteres");
            toast.dismiss(toastId);
            return;
        }

        try {
            setIsSubmitting(true);

            let profileImageUrl = user?.profileImageUrl || null;

            if (profileImage) {
                const formData = new FormData();
                formData.append("image", profileImage);

                const uploadResponse = await axiosInstance.post(
                    API_PATHS.ARCHIVOS.SUBIR_IMAGEN_PERFIL,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                profileImageUrl = uploadResponse.data.imageUrl;
            }

            if (!preview && user?.profileImageUrl) {
                profileImageUrl = null;
            }

            const response = await axiosInstance.put(
                API_PATHS.USUARIOS.PRIVADOS.ACTUALIZAR_PERFIL,
                { name, bio, profileImageUrl }
            );

            updateUserProfile(response.data);
            setSuccess("Perfil actualizado correctamente");

            toast.dismiss(toastId);
            toast.success("Perfil actualizado correctamente");
        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Error al actualizar el perfil");
            setError(error.response?.data?.message || "Error al actualizar el perfil");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Datos personales</h2>

            <ProfilePhotoSelector
                image={profileImage}
                setImage={setProfileImage}
                preview={preview}
                setPreview={setPreview}
            />

            <PhotoCriteria />

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-sm text-gray-400 mt-1">{name.length}/50</p>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía
                </label>
                <textarea
                    id="bio"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={200}
                    rows={10}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-sm text-gray-400 mt-1">{bio.length}/200</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
            >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
        </form>
    );
};

export default ProfileInfoForm;