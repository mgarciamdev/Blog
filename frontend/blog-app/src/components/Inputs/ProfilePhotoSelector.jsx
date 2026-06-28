/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { LuTrash, LuUpload, LuUser } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview, onRemove }) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (preview) {
            setPreviewUrl(preview);
        }
    }, [preview])

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setImage(file);

        const imagePreview = URL.createObjectURL(file);

        setPreviewUrl(imagePreview);

        if (setPreview) {
            setPreview(imagePreview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);

        if (setPreview) {
            setPreview(null)
        }

        if (onRemove) {
            onRemove();
        }
    };

    const onChooseFile = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!previewUrl ? (
                <div className="w-24 h-24 flex items-center justify-center border border-emerald-200 bg-green-50 rounded-full relative cursor-pointer">
                    <LuUser className="text-4xl text-green-500" />

                    <button
                        type="button"
                        onClick={onChooseFile}
                        className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-green-500 to-emerald-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Foto de perfil"
                        className="w-24 h-24 bg-slate-400 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"    
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;