import { API_PATHS } from "./apiPaths";
import publicAxios from "./publicAxios";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    formData.append('image', imageFile);

    try {
        const response = await publicAxios.post(API_PATHS.ARCHIVOS.SUBIR_IMAGEN_PERFIL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;

    } catch (error) {
        console.error('Error al subir la imagen: ', error);
        throw error;
    }
};

export default uploadImage;