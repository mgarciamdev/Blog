import React, { useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import AuthInput from '../../../components/Inputs/AuthInput';
import { LuLoaderCircle } from 'react-icons/lu';

const GenerateBlogPostForm = ({ contentParams, setPostContent, handleCloseForm }) => {
    const [formData, setFormData] = useState({
        title: contentParams?.title || "",
        tone: contentParams?.tone || "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleGeneratedBlogPost = async (e) => {
        e.prevendDefault();

        const { title, tone } = formData;

        if (!title || !tone) {
            setError("Por favor, rellene todos los campos obligatorios.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const aiResponse = await axiosInstance.post(API_PATHS.IA.GENERAR_POST,
                {
                    title,
                    tone,
                }
            );

            const generatedPost = aiResponse.data;

            setPostContent(title, generatedPost || "");
            handleCloseForm();

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Algo salió mal. Inténtalo de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[90vw] md:w-[35vw] p-7 pb-6 flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-black">Generar una entrada de blog</h3>
            <p className="text-xs text-slate-700 mt-1.25 mb-3">
                Proporciona un título y un tono para generar tu entrada de blog.
            </p>

            <form onSubmit={handleGeneratedBlogPost}>
                <AuthInput
                    value={formData.title}
                    onChange={({ target }) => handleChange("title", target.value)}
                    label="Blog Post Title"
                    placeholder="Mi primer app en React"
                    type="text"
                />

                <AuthInput
                    value={formData.tone}
                    onChange={({ target }) => handleChange("tone", target.value)}
                    label="Tone"
                    placeholder="begginer, friendly, technical, casual, etc"
                    type="text"
                />

                {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                <button
                    type="submit"
                    className="btn-primary w-full mt-2"
                    disabled={isLoading}
                >
                    {isLoading && <LuLoaderCircle className="animate-spin text-[18px]" />}{" "}
                    {isLoading ? "Generando..." : "Generar publicación"}
                </button>
            </form>
        </div>
    );
};

export default GenerateBlogPostForm;