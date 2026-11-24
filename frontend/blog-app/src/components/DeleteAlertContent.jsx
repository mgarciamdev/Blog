import React from 'react'
import { useState } from 'react';

const DeleteAlertContent = ({ content, onDelete, onCancel, requireReason = false, reasonLabel = "Motivo", reasonPlaceholder = "Describe el motivo de la eliminación" }) => {

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleDeleteClick = () => {
        if (requireReason && !reason.trim()) {
            setError("Debes indicar un motivo para continuar");
            return;
        }

        onDelete(reason.trim());
    };

    return (
        <div className="p-5">
            <p className="text-[14px]">{content}</p>

            {requireReason && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{reasonLabel}</label>
                    <textarea
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder={reasonPlaceholder}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                        rows={3}
                    />
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                <button
                    type="button"
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    onClick={onCancel}
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl transition"
                    onClick={handleDeleteClick}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default DeleteAlertContent;