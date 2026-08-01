import React, { useState } from 'react'
import { CiExport } from 'react-icons/ci';
import Modal from '../components/Modal';
import ExportModalContent from './ExportModalContent';

const ExportButton = () => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="btn-small mt-4 md:mt-0 ml-auto mr-1 flex items-center gap-2"
                onClick={() => setOpen(true)}
            >
                <CiExport className="text-[18px]" /> Exportar Datos
            </button>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Exportar Reporte"
            >
                <ExportModalContent 
                    onClose={() => setOpen(false)}
                />
            </Modal>
        </>
    );
};

export default ExportButton;