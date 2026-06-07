import React from 'react'

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
    return (
        <div className="p-5">
            <p className="text-[14px]">{content}</p>

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
                    onClick={onDelete}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default DeleteAlertContent;