import React, { useState } from 'react'
import { LuInfo, LuX } from 'react-icons/lu';

const PhotoCriteria = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1.5 transition-colors"
            >
                <LuInfo className="text-sm" />
                Criterios de la foto
            </button>

            {open && (
                <div className="absolute z-10 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Criterios para la foto de perfil
                        </h3>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <LuX className="text-base" />
                        </button>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-600 list-disc list-inside">
                        <li>Formatos permitidos: JPG, PNG o WEBP.</li>
                        <li>Tamaño máximo: 2 MB.</li>
                        <li>Se recomienda una imagen cuadrada para mejor recorte.</li>
                        <li>Evita imágenes borrosas o con poca iluminación.</li>
                        <li>No se permite contenido ofensivo o inapropiado.</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PhotoCriteria;