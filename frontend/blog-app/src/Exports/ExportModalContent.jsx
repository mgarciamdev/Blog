import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import DropdownSelect from '../components/Inputs/DropdownSelect';

const EXPORT_OPTIONS = [
    {
        label: "PDF",
        value: "pdf"
    },
    {
        label: "Excel",
        value: "xlsx"
    },
    {
        label: "CSV",
        value: "csv"
    },
];

const ExportModalContent = ({ onClose }) => {

    const [format, setFormat] = useState("pdf");
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {

        setLoading(true);

        const toastId = toast.loading("Exportando Datos....");

        try {

            const response = await axiosInstance.get(
                API_PATHS.ADMIN.EXPORTAR_REPORTE(format),
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            const disposition = response.headers["content-disposition"];

            let filename = `usuarios.${format}`;

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);

                if (match) {
                    filename = match[1];
                }
            }

            link.href = url;
            link.download = filename;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            onClose();

            toast.success("Exportación exitosa", { id: toastId });

        } catch (error) {
            console.error(error);
            toast.error("Error al exportar el reporte", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-105 p-6 mt-lg-3">

            <p className="text-sm text-slate-500 mb-6">
                Selecciona el formato del reporte.
            </p>

            <DropdownSelect
                label="Formato"
                options={EXPORT_OPTIONS}
                value={format}
                onChange={setFormat}
            />

            <div className="flex justify-end gap-3 mt-8">

                <button
                    className="btn-primary"
                    onClick={handleExport}
                    disabled={loading}
                >
                    {loading
                        ? "Exportando..."
                        : "Exportar Reporte"}
                </button>

            </div>

        </div>
    );
};

export default ExportModalContent;