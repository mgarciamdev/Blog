/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'

// aqui comienzo a definir
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from 'react-icons/lu';
import Tabs from '../../components/Tabs';
import BlogPostSummaryCard from '../../components/Cards/BlogPostSummaryCard';
import Modal from '../../components/Modal';
import DeleteAlertContent from '../../components/DeleteAlertContent';
import moment from 'moment';


const BlogPosts = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.POSTS.QUERIES.OBTENER_TODOS_LOS_POST,
        {
          params: {
            status: filterStatus,
            page: pageNumber,
          },
        }
      );

      const { posts, pagination, counts } = response.data;

      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );

      setTotalPages(pagination.pages);
      setPage(pagination.page);

      const statusSummary = counts || {};

      const statusArray = [
        { label: "Todos", value: "all", count: statusSummary.all || 0 },
        { label: "Publicados", value: "published", count: statusSummary.published || 0 },
        { label: "Borradores", value: "draft", count: statusSummary.draft || 0 },
      ];

      setTabs(statusArray);

    } catch (error) {
      console.error("Error al obtener los posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(
        API_PATHS.POSTS.CRUD.ELIMINAR_POST(postId)
      );

      toast.success("Post eliminado correctamente...");

      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      await getAllPosts(1);

    } catch (error) {
      console.error("Error al borrar el post:", error);
    }
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      await getAllPosts(page + 1);
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteAlert({
      open: false,
      data: null,
    });
  };

  useEffect(() => {
    getAllPosts(1);
  }, [filterStatus]);

  return (
    <DashboardLayout>
      <div className="w-auto sm:max-w-225 mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Blog Posts</h2>

          <button
            className="btn-small"
            onClick={() => navigate("/create")}
          >
            <LuPlus className="text-[18px]" /> Crear Post
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />

        <div className="mt-5">
          {blogPostList.map((post) => (
            <BlogPostSummaryCard
              key={post._id}
              title={post.title}
              imgUrl={post.coverImageUrl}
              updatedOn={
                post.updatedAt
                  ? moment(post.createdAt).format("Do MMM YYYY")
                  : "-"
              }
              tags={post.tags}
              likes={post.likes}
              dislikes={post.dislikes}
              views={post.views}
              onClick={() => navigate(`/edit/${post.slug}`)}
              onDelete={() => setOpenDeleteAlert({ open: true, data: post._id })}
            />
          ))}

          {page < totalPages && (
            <div className="flex items-center justify-center mb-8">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2.5 rounded-full text-nowrap hover:scale-105 transition-all cursor-pointer"
                disabled={isLoading}
                onClick={handleLoadMore}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Alerta de Eliminación"
      >
        <div className="w-[70vw] md:w-[30vw]">
          <DeleteAlertContent
            content="¿Estas seguro(a) de querer eliminar el siguiente post?"
            onDelete={() => deletePost(openDeleteAlert.data)}
            onCancel={closeDeleteModal}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPosts;