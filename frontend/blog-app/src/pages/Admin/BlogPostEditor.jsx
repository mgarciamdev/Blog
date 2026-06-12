import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import MDEditor, { commands } from '@uiw/react-md-editor'
import { LuLoaderCircle, LuSave, LuSend, LuSparkles, LuTrash2 } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate, useParams } from 'react-router-dom';
import CoverImageSelector from '../../components/Inputs/CoverImageSelector';
import TagInput from '../../components/Inputs/TagInput';
import SkeletonLoader from '../../components/Loaders/skeletonLoader';
import BlogPostIdeaCard from '../../components/Cards/BlogPostIdeaCard';
import Modal from '../../components/Modal';
import GenerateBlogPostForm from './components/GenerateBlogPostForm';
import DeleteAlertContent from '../../components/DeleteAlertContent';
import toast from 'react-hot-toast';
import uploadCoverImage from '../../utils/uploadCoverImage';
import { getToastMessagesByType } from '../../utils/helper';


const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug = "" } = useParams();

  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: [],
    isDraft: false,
    generatedByAI: false,
  });

  const [postIdeas, setPostIdeas] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });

  const [ideaLoading, setIdeaLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const handleValueChange = (key, value) => {
    setError("");

    setPostData((prevData) => ({ ...prevData, [key]: value }));
  }

  const generatePostIdeas = async () => {
    setIdeaLoading(true);

    try {
      const aiResponse = await axiosInstance.post(API_PATHS.IA.GENERAR_IDEAS_PARA_POST,
        {
          topics: "React Js, Next Js, Node Js, React UI Components",
        }
      );

      const generatedIdeas = aiResponse.data?.ideas || [];

      if (generatedIdeas?.length > 0) {
        setPostIdeas(generatedIdeas);
      }
    } catch (error) {
      console.log("A veces algo falla. Por favor, inténtalo de nuevo.", error)
    } finally {
      setIdeaLoading(false);
    }
  };

  const handlePublish = async (isDraft) => {
    const toastId = toast.loading("Publicando ....");

    let coverImageUrl = "";

    if (!postData.title.trim()) {
      setError("Por favor ingresa un titulo");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    if (!postData.content.trim()) {
      setError("Por favor escribe algun contenido");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    if (!isDraft) {
      if (!isEdit && !postData.coverImageUrl && !postData.coverPreview) {
        setError("Por favor, seleccione una imagen de portada.");
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }

      if (!postData.tags.length) {
        setError("Por favor agregue algunas etiquetas (tags)");
        toast.dismiss(toastId);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      if (postData.coverImageUrl instanceof File) {
        const covUploadRes = await uploadCoverImage(postData.coverImageUrl);

        coverImageUrl = covUploadRes.imageUrl || "";

      } else {
        coverImageUrl = postData.coverPreview;
      }

      const reqPayload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAI: postData.generatedByAI || false,
      };

      const response = isEdit
        ? await axiosInstance.put(API_PATHS.POSTS.CRUD.ACTUALIZAR_POST(postData.id), reqPayload)
        : await axiosInstance.post(API_PATHS.POSTS.CRUD.CREAR_POST, reqPayload);

      if (response.data) {
        toast.dismiss(toastId);

        toast.success(getToastMessagesByType(
          isDraft ? "draft" : isEdit ? "edit" : "published"
        ));

        navigate("/posts");
      }

    } catch (error) {
      toast.dismiss(toastId);

      setError("No se pudo publicar la entrada del blog. Inténtalo de nuevo.");

      console.error("Error al publicar la entrada del blog:", error);
      console.error("Error completo", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.POSTS.QUERIES.OBTENER_POST_POR_SLUG(postSlug));

      if (response.data?.post) {
        const data = response.data?.post;

        setPostData((prevState) => ({
          ...prevState,
          id: data.id,
          title: data.title,
          content: data.content,
          coverPreview: data.coverImageUrl || "",
          tags: data.tags,
          isDraft: data.isDraft,
          generatedByAI: data.generatedByAI,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deletePost = async () => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.CRUD.ELIMINAR_POST(postData.id));

      toast.success("Publicación eliminada correctamente");

      setOpenDeleteAlert({
        open: false,
        data: null
      });

      navigate("/posts", { replace: true });

    } catch (error) {
      console.error("Error al eliminar la publicación", error);
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteAlert({
      open: false,
      data: null,
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostDetailsBySlug();
    } else {
      generatePostIdeas();
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="my-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">

              <h2 className="text-base md:text-lg font-medium">
                {!isEdit ? "Añadir nueva publicación" : "Editar publicación"}
              </h2>

              <div className="flex items-center gap-3">
                {isEdit && (
                  <button
                    className="flex items-center gap-2.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px-1.5 md:px-3 py-1 md:py-0.75 border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert({
                      open: true,
                      data: postData.id,
                    })}
                  >
                    <LuTrash2 className="text-sm" /> {" "}
                    <span className="hidden md:block">Eliminar</span>

                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-500 bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-0.75 border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-[1.02] transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-sm" />{" "}
                  <span className="hidden md:block">Guardar como borrador</span>

                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] font-medium text-sky-600 hover:text-white hover:bg-linear-to-r hover:from-sky-500 hover:to-indigo-500 rounded px-3 py-0.75 border border-sky-500 hover:border-sky-50 cursor-pointer transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-sm" />
                  )}{" "}
                  Publicar
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Titulo del Post
              </label>

              <input
                type="text"
                placeholder="Como construir una Aplicación utilizando el Stack MERN"
                className="form-input"
                value={postData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-4">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={(value) => handleValueChange("coverImageUrl", value)}
                preview={postData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Contenido
              </label>

              <div className="mt-3">
                <MDEditor
                  value={postData.content}
                  data-color-mode="light"
                  height={400}
                  onChange={(data) => {
                    handleValueChange("content", data || "")
                  }}
                  commands={[
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.title,
                    commands.divider,
                    commands.quote,
                    commands.link,
                    commands.code,
                    commands.image,
                    commands.table,
                    commands.divider,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                    commands.divider,
                    commands.help,
                  ]}
                  hideMenu={true}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Tags</label>

              <TagInput
                tags={postData?.tags || []}
                setTags={(data) => {
                  handleValueChange("tags", data);
                }}
              />

              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => navigate("/posts")}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-emerald-600 hover:text-white hover:bg-linear-to-r hover:from-green-500 hover:to-emerald-500 rounded px-3 py-0.75 border border-emerald-500 hover:border-emerald-100  cursor-pointer transition-all"
                >
                  Regresar a Posts
                </button>
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className="form-card col-span-12 md:col-span-4 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between px-6 pt-6 gap-2 mb-4">
                <h4 className="text-sm md:text-base font-medium inline-flex items-center gap-2">
                  <span className="text-emerald-600">
                    <LuSparkles />
                  </span>
                  Ideas para tu próxima publicación
                </h4>

                <button
                  className="bg-linear-to-r from-green-500 to-emerald-400 text-[13px] font-semibold text-white px-3 py-1 rounded transition-colors cursor-pointer hover:shadow-2xl"
                  onClick={() => setOpenBlogPostGenForm({
                    open: true,
                    data: null,
                  })}
                >
                  Generar Ideas
                </button>

              </div>
              <div>
                {ideaLoading ? (
                  <div className="p-5">
                    <SkeletonLoader />
                  </div>
                ) : (
                  postIdeas.map((idea, index) => (
                    <BlogPostIdeaCard
                      key={`idea_${index}`}
                      title={idea.title || ""}
                      description={idea.description || ""}
                      tags={idea.tags || []}
                      tone={idea.tone || "casual"}
                      onSelect={() =>
                        setOpenBlogPostGenForm({ open: true, data: idea })
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openBlogPostGenForm?.open}
        onClose={() => {
          setOpenBlogPostGenForm({ open: false, data: null });
        }}
        hideHeader
      >
        <GenerateBlogPostForm
          contentParams={openBlogPostGenForm?.data || null}
          setPostContent={(title, content) => {
            const postInfo = openBlogPostGenForm?.data || null;
            setPostData((prevState) => ({
              ...prevState,
              title: title || prevState.title,
              content: content,
              tags: postInfo?.tags || prevState.tags,
              generatedByAI: true,
            }));
          }}
          handleCloseForm={() => {
            setOpenBlogPostGenForm({ open: false, data: null });
          }}
        />
      </Modal>

      <Modal
        isOpen={openDeleteAlert.open}
        onClose={closeDeleteModal}
        title="Alerta de Eliminación"
      >
        <div className="w-[90vw] max-w-md">
          <DeleteAlertContent
            content="¿Estas seguro(a) de querer eliminar la siguiente publicación?"
            onDelete={deletePost}
            onCancel={closeDeleteModal}
          />
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default BlogPostEditor;