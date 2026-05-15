import { API_PATHS } from "./apiPaths";
import publicAxios from "./publicAxios";

const uploadFile = async (documentFile) => {
    const formData = new FormData();

    formData.append('file', documentFile);

    try {
        const response = await publicAxios.post(API_PATHS.ARCHIVOS.SUBIR_ARCHIVOS, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al subir el archivo: ', error);
        throw error;
    }
};

export default uploadFile;