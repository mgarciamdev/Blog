import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { isAdminRole } from '../../utils/helper';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import DashboardHeader from './sections/DashboardHeader';
import OverviewSection from './sections/OverViewSection';
import AdminInsightsSection from './sections/AdminInsightsSection';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = isAdminRole(user?.role);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OBTENER_DASHBOARD);

      const data = response.data;

      setDashboardData(data);

    } catch (error) {
      error.response?.data?.message ||
        "Error al cargar dashboard"
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getDashboardData();
  }, []);
  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <>
        <DashboardHeader user={user} />

        <OverviewSection stats={dashboardData?.stats} />

        {isAdmin && (
          <AdminInsightsSection
            tagUsage={dashboardData?.tagUsage || []}
            topPosts={dashboardData?.topPosts || []}
            stats={dashboardData?.stats}
          />
        )}
      </>
    </DashboardLayout>
  )
}

export default Dashboard