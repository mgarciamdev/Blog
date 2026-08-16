import { useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { UserContext } from './userContext';

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAuthForm, setOpenAuthForm] = useState(false);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(
          API_PATHS.USUARIOS.PRIVADOS.OBTENER_PERFIL
        );

        setUser(response.data.user);

      } catch (error) {
        console.error("Usuario no autenticado", error);

        clearUser();

      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData.user);

    localStorage.setItem(
      "accessToken",
      userData.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      userData.refreshToken
    );
  };

  const updateUserProfile = (userData) => {
    setUser(userData.user);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        updateUser,
        updateUserProfile,
        clearUser,
        openAuthForm,
        setOpenAuthForm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;