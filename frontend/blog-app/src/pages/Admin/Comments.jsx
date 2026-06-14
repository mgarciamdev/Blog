import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import CommentInfoCard from '../../components/Cards/CommentInfoCard';
import Modal from '../../components/Modal';
import DeleteAlertContent from '../../components/DeleteAlertContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';
import SkeletonLoader from '../../components/Loaders/skeletonLoader';

const Comments = () => {

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const getAllComments = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(API_PATHS.COMENTARIOS.OBTENER_TODOS_LOS_COMENTARIOS);

      setComments(response.data?.comments || []);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(API_PATHS.COMENTARIOS.ELIMINAR_COMENTARIO(commentId));

      toast.success("Comentario eliminado correctamente");

      setOpenDeleteAlert({
        open: false,
        data: null,
      });

      getAllComments();

    } catch (error) {
      console.error("Error al eliminar la entrada del blog:", error);
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteAlert({
      open: false,
      data: null,
    });
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <DashboardLayout>
      <div className="w-auto sm:max-w-225 mx-auto">
        <h2 className="text-2xl font-semibold mt-5 mb-5">Manejo de Comentarios</h2>

        {initialLoading ? (
          <SkeletonLoader />
        ) : (
          comments.map((comment) => (
            <CommentInfoCard
              key={comment._id}
              commentId={comment._id || null}
              authorName={comment.author?.name || "Usuario"}
              authorPhoto={comment.author?.profileImageUrl || null}
              content={comment.content}
              updatedOn={
                comment.updatedAt
                  ? moment(comment.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              post={comment.post}
              replies={comment.replies || []}
              getAllComments={getAllComments}
              onDelete={(commentId) =>
                setOpenDeleteAlert({ open: true, data: commentId || comment._id })
              }
              loading={loading}
            />
          ))
        )}

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
            content="¿Estas seguro(a) de querer eliminar este comentario y todas sus respuestas?"
            onDelete={() => deleteComment(openDeleteAlert.data)}
            onCancel={closeDeleteModal}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Comments;