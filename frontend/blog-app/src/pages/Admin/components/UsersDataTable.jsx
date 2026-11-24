import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import toast from 'react-hot-toast';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import EditUserForm from './EditUserForm';
import { LuEllipsisVertical, LuPencil, LuTrash2, LuSearch, LuPlus, LuRotateCcw } from "react-icons/lu";
import { CiExport } from "react-icons/ci";
import DeleteAlertContent from '../../../components/DeleteAlertContent';
import Modal from '../../../components/Modal';
import DropDownSelect from '../../../components/Inputs/DropdownSelect';
import { UserContext } from '../../../context/userContext';
import CreateUserForm from './CreateUserForm';
import { canManageUser, canCreateAdmin, canExportReport } from '../../../utils/permissions';
import dayjs from "dayjs";
import "dayjs/locale/es";
import DropdownSelect from '../../../components/Inputs/DropdownSelect';
import ExportButton from '../../../Exports/ExportButton';

const UsersDataTable = () => {
    dayjs.locale("es");

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        open: false,
        data: null,
    });
    const [openMenu, setOpenMenu] = useState(null);
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const { user } = useContext(UserContext);

    const refresh = () => setRefreshKey((k) => k + 1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(search.trim());
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let ignore = false;

        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await axiosInstance.get(API_PATHS.ADMIN.OBTENER_TODOS_LOS_USUARIOS,
                    {
                        params: {
                            page: currentPage,
                            limit: usersPerPage,
                            search: debounceSearch || undefined,
                            role: roleFilter !== "all" ? roleFilter : undefined,
                            status: statusFilter,
                        }
                    },
                );

                if (ignore) return;

                const { users: list, total: count, pages } = response.data;

                setUsers(list || []);
                setTotal(count || 0);
                setTotalPages(pages || 1);

                if (currentPage > (pages || 1)) setCurrentPage(pages || 1);

            } catch (error) {
                if (!ignore) console.error("Error al obtener los usuarios:", error);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchUsers();

        return () => { ignore = true; };
    }, [currentPage, usersPerPage, debounceSearch, roleFilter, statusFilter, refreshKey]);

    const deleteUser = async (id, reason) => {
        try {
            await axiosInstance.delete(API_PATHS.ADMIN.ELIMINAR_USUARIO(id),
                { data: { reason } }
            );

            toast.success("Usuario eliminado correctamente...");

            setOpenDeleteAlert({
                open: false,
                data: null,
            });

            refresh();
        } catch (error) {
            console.error("Error al borrar el usuario:", error);
            toast.error(error.response?.data?.message || "Error al eliminar el usuario.");
            setOpenDeleteAlert({
                open: false,
                data: null,
            });
        }
    };

    const handleRestore = async (id) => {
        try {
            await axiosInstance.patch(API_PATHS.ADMIN.RESTAURAR_USUARIO(id));
            toast.success("Usuario restaurado correctamente");
            refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al restaurar el usuario");
        }
    };

    const closeDeleteModal = () => {
        setOpenDeleteAlert({
            open: false,
            data: null,
        });
    };

    const roleBadge = {
        superadmin: {
            label: "Super Admin",
            className: "bg-purple-100 text-purple-700",
        },
        admin: {
            label: "Admin",
            className: "bg-amber-100 text-amber-700",
        },
        member: {
            label: "Member",
            className: "bg-emerald-100 text-emerald-700",
        },
    };

    const indexOfFirstUser = (currentPage - 1) * usersPerPage;

    const options = [10, 15, 20, 25, 30];

    const pageNumbers = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, "...", totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, totalPages);
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">Directorio de Usuarios</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                        Sistema de usuarios ({total} usuarios)
                    </p>
                </div>

                {canExportReport(user) && (
                    <ExportButton />
                )}

                {canCreateAdmin(user) && (
                    <button
                        className="btn-small mt-4 md:mt-0"
                        onClick={() => {
                            setOpenCreateModal(true);
                        }}
                    >
                        <LuPlus className="text-[18px]" /> Añadir Usuario
                    </button>
                )}
            </div>
            <div className="flex flex-col lg:flex-row mb-6 gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <LuSearch
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o username"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {/* Roles */}
                <DropDownSelect
                    value={roleFilter}
                    onChange={(value) => {
                        setRoleFilter(value);
                        setCurrentPage(1);
                    }}
                    className="min-w-42.5"
                    options={[
                        {
                            value: "all",
                            label: "Todos los Roles",
                        },
                        {
                            value: "member",
                            label: "Member",
                        },
                        {
                            value: "admin",
                            label: "Admin",
                        },
                        {
                            value: "superadmin",
                            label: "Super Admin",
                        },
                    ]}
                />

                {/* Estado */}
                <DropDownSelect
                    value={statusFilter}
                    onChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                    }}
                    className="min-w-45"
                    options={[
                        {
                            value: "all",
                            label: "Todos los Estados",
                        },
                        {
                            value: "verified",
                            label: "Verificados",
                        },
                        {
                            value: "not_verified",
                            label: "No Verificados",
                        },
                        {
                            value: "banned",
                            label: "Baneados",
                        },
                        {
                            value: "deleted",
                            label: "Eliminados",
                        }
                    ]}
                />

            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                {loading ? (
                    <div className="p-10 text-center">
                        Cargando usuarios....
                    </div>
                ) : (
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-gray-200">
                            <tr className="divide-x divide-gray-300">
                                <th className="w-12">ID</th>
                                <th className="w-48 px-4 py-3">Nombre</th>
                                <th className="w-64 px-4 py-3">Correo Electronico</th>
                                <th className="w-56 px-4 py-3">Nombre de Usuario</th>
                                <th className="w-36 px-4 py-3">Rol</th>
                                <th className="w-36 px-4 py-3 text-sm">Fecha de registro</th>
                                <th className="w-40 px-4 py-3">Estado</th>
                                <th className="w-44 px-4 py-3 hidden lg:table-cell">Estado de Ban</th>
                                <th className="w-20 px-4 py-3 hidden lg:table-cell">Strikes</th>
                                <th className="w-20 px-4 py-3">Acciones</th>
                            </tr>
                        </thead>

                        <AnimatePresence mode="wait">
                            <motion.tbody
                                key={`${currentPage}-${debounceSearch}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white divide-y divide-gray-100 transition-colors duration-300"
                            >
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="px-4 py-10 text-gray-500">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                )}

                                {users.map((usuario, index) => (
                                    <tr className="divide-x divide-gray-300" key={usuario._id}>
                                        <td className="px-4 py-3">{indexOfFirstUser + index + 1}</td>
                                        <td className="px-4 py-3">{usuario.name}</td>
                                        <td className="px-4 py-3 truncate">{usuario.email}</td>
                                        <td className="px-4 py-3">
                                            @{usuario.username
                                                ? `${usuario.username}`
                                                : "No cuenta con nombre de usuario"
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex justify-center items-center min-w-24 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge[usuario.role].className}`}
                                            >
                                                {roleBadge[usuario.role].label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {dayjs(usuario.createdAt).format("DD MMM YYYY")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {usuario.isDeleted ? (
                                                <span
                                                    title={
                                                        usuario.deletedBy
                                                            ? "Eliminada por un administrador. solo un admin puede reactivarla."
                                                            : `Se eliminará definitivamente el ${dayjs(usuario.deletedAt).add(30, "day").format("DD MMM YYYY")}`
                                                    }
                                                    className="px-6 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700"
                                                >
                                                    Eliminada
                                                </span>
                                            ) : usuario.isVerified ? (
                                                <span className="px-6 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                    Verificado
                                                </span>
                                            ) : (
                                                <span className="px-4 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                    No verificado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            {usuario.isDeleted ? (
                                                <span className="text-gray-400">—</span>
                                            ) : usuario.isBanned ? (
                                                <span className="px-6 py-1 rounded-full text-xs font-semibold bg-rose-100 text-red-700">
                                                    Baneado
                                                </span>
                                            ) : usuario.activeStrikePoints >= 2 ? (
                                                <span className="px-6 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                                    Riesgo Alto
                                                </span>
                                            ) : usuario.activeStrikePoints >= 1 ? (
                                                <span className="px-6 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                                    En Peligro
                                                </span>
                                            ) : (
                                                <span className="px-6 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-green-700">
                                                    Perfecto
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">{usuario.activeStrikePoints}</td>
                                        <td className="px-4 py-3">
                                            <div className="relative inline-block">
                                                {!canManageUser(user, usuario) ? (
                                                    <span className="">
                                                        <LuEllipsisVertical size={18} title="Acciones Bloqueadas" />
                                                    </span>
                                                ) : usuario.isDeleted ? (
                                                    usuario.deletedBy ? (
                                                        <button
                                                            title="Restaurar"
                                                            className="p-2 rounded-lg hover:bg-gray-100 text-emerald-600"
                                                            onClick={() => handleRestore(usuario._id)}
                                                        >
                                                            <LuRotateCcw size={18} />
                                                        </button>
                                                    ) : (
                                                        <span title="El usuario puede reactivarla desde el login">
                                                            <LuEllipsisVertical size={18} />
                                                        </span>
                                                    )
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={
                                                                () => setOpenMenu(
                                                                    openMenu === usuario._id
                                                                        ? null
                                                                        : usuario._id
                                                                )}
                                                            className="p-2 rounded-lg hover:bg-gray-100"
                                                        >
                                                            <LuEllipsisVertical size={18} />
                                                        </button>

                                                        {openMenu === usuario._id && (
                                                            <div className="absolute right-7 -mt-7 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                                                                <button
                                                                    title="Editar"
                                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                                                    onClick={() => {
                                                                        setSelectedUser(usuario);
                                                                        setOpenEditModal(true);
                                                                        setOpenMenu(null);
                                                                    }}
                                                                >
                                                                    <LuPencil className="text-blue-400" />
                                                                </button>

                                                                <button
                                                                    title="Eliminar"
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                                                                    onClick={() => {
                                                                        setOpenDeleteAlert({
                                                                            open: true,
                                                                            data: usuario._id,
                                                                        });
                                                                        setOpenMenu(null);
                                                                    }}
                                                                >
                                                                    <LuTrash2 />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </motion.tbody>
                        </AnimatePresence>
                    </table>
                )
                }
            </div >

            <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
                {/* Información */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Filas por página</span>

                    <DropdownSelect
                        value={usersPerPage}
                        onChange={(value) => {
                            setUsersPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                        className="min-w-24"
                        options={options.map(opt => ({
                            value: opt,
                            label: opt
                        }))}
                    />

                    <span>
                        de {total} filas
                    </span>
                </div>

                {/* Navegación */}
                <div className="flex items-center gap-2">

                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-2xl border hover:bg-gray-100 disabled:opacity-40"
                    >
                        {"<<"}
                    </button>

                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-7 h-7 rounded-2xl border hover:bg-gray-100 disabled:opacity-40"
                    >
                        {"<"}
                    </button>

                    {pageNumbers.map((page, index) =>
                        page === "..." ? (
                            <span
                                key={index}
                                className="px-2"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-2xl transition ${currentPage === page
                                    ? "bg-slate-700 text-white"
                                    : "border hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 rounded-2xl border hover:bg-gray-100 disabled:opacity-40"
                    >
                        {">"}
                    </button>

                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 rounded-2xl border hover:bg-gray-100 disabled:opacity-40"
                    >
                        {">>"}
                    </button>
                </div>
            </div>

            {openDeleteAlert.open && (
                <Modal
                    isOpen={openDeleteAlert?.open}
                    onClose={() => {
                        setOpenDeleteAlert({ open: false, data: null });
                    }}
                    title="Alerta de Eliminación de Usuario"
                >
                    <div className="w-[70vw] md:w-[30vw]">
                        <DeleteAlertContent
                            content="¿Esta cuenta se desactivará y se eliminará definitivamente a los 30 días. El usuario no podrá reactivarla"
                            requireReason
                            reasonLabel="Motivo de la eliminación"
                            reasonPlaceholder="Explica por qué se elimina esta cuenta..."
                            onDelete={(reason) => deleteUser(openDeleteAlert.data, reason)}
                            onCancel={closeDeleteModal}
                        />
                    </div>
                </Modal>
            )}

            < EditUserForm
                user={selectedUser}
                isOpen={openEditModal}
                onClose={() => setOpenEditModal(false)}
                onUserUpdated={refresh}
            />

            <CreateUserForm
                isOpen={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onUserCreated={refresh}
            />

        </div >
    );
};

export default UsersDataTable;