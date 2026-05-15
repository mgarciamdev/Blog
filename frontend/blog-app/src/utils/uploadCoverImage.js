import { API_PATHS } from "./apiPaths";
import publicAxios from "./publicAxios";

const uploadCoverImage = async (coverImageFile) => {
    const formData = new FormData();

    formData.append('image', coverImageFile);

    try {
        const response = await publicAxios.post(API_PATHS.ARCHIVOS.SUBIR_PORTADA, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;

    } catch (error) {
        console.error('Error al subir la imagen de portada');
        throw error;
    }
}

export default uploadCoverImage;