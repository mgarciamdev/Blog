import React, { useState } from 'react'
import AuthInput from './AuthInput';
import { LuLoaderCircle, LuReply, LuSend, LuWandSparkles } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import CharAvatar from '../Cards/CharAvatar';

const CommentReplyInput = ({ user, authorName, content, replyText, setReplyText, handleAddReply, handleCancelReply, disableAutoGen, type = "reply" }) => {
    const [loading, setLoading] = useState(false);

    const generateReply = async () => {
        setLoading(true);

        try {
            const aiResponse = await axiosInstance.post(API_PATHS.IA.GENERAR_RESPUESTA_A_COMENTARIO,
                {
                    author: { name: authorName },
                    content
                }
            );

            const generatedReply = aiResponse.data?.reply;

            if (generatedReply?.length > 0) {
                setReplyText(generatedReply);
            }

        } catch (error) {
            console.log("Algo salió mal. Por favor, inténtalo de nuevo.", error);
        } finally {
            setLoading(false);
        }
    };

    const onReply = () => {
        if (!replyText.trim() || loading) return;

        handleAddReply();
    };

    return (
        <div className="mt-5 ml-0 md:ml-10 relative">
            <div className="flex items-start gap-3">
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt={user?.name || "Usuario"}
                        className="w-10 h-10 rounded-full"
                    />
                ) : (
                    <CharAvatar
                        fullName={user?.name || ""}
                        width="w-9"
                        height="h-9"
                        style="text-sm hover:bg-linear-to-r from-gray-400 to-gray-200"
                    />
                )}

                <div className="flex-1">
                    <AuthInput
                        value={replyText}
                        onChange={({ target }) => setReplyText(target.value)}
                        label={
                            type === "new"
                                ? authorName
                                : `Respondiendo a @${authorName}`
                        }
                        placeholder={
                            type === "new" ? "Escribe un mensaje..." : "Escribe tu respuesta..."
                        }
                        type="text"
                        disabled={loading}
                    />

                    <div className="flex flex-wrap items-center justify-end gap-3 mt-2">
                        <button
                            className={`flex items-center gap-1.5 text-[14px] font-medium text-sky-950 bg-gray-100 px-4 py-0.5 rounded-full hover:bg-gray-800 hover:text-white cursor-pointer`}
                            disabled={loading}
                            onClick={handleCancelReply}
                        >
                            Cancelar
                        </button>

                        <button
                            className={`flex items-center gap-1.5 text-[14px] font-medium px-4 py-0.5 rounded-full text-sky-600 bg-sky-50 hover:bg-sky-500 cursor-pointer`}
                            disabled={!replyText.trim() || loading}
                            onClick={onReply}
                        >
                            {loading ? (
                                <LuLoaderCircle className="animate-spin text-[15px]" />
                            ) : type === "new" ? (
                                <>
                                    <LuSend className="text-[13px]" /> Añadir
                                </>
                            ) : (
                                <>
                                    <LuReply className="text-[18px]" /> Responder
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {!disableAutoGen && (
                    <button
                        className="flex items-center gap-1.5 text-[13px] font-medium text-sky-500 bg-sky-50 px-2 md:px-4 py-0.5 rounded-full hover:bg-sky-500 hover:text-white cursor-pointer absolute top-0 right-0"
                        disabled={loading}
                        onClick={generateReply}
                    >
                        {loading ? (
                            <LuLoaderCircle className="animate-spin text-[15px]" />
                        ) : (
                            <LuWandSparkles className="text-[15px]" />
                        )}

                        <span className="hidden md:inline">
                            {loading ? "Generando Respuesta...." : "Generar Respuesta"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentReplyInput;