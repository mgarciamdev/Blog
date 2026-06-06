import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import DashboardHeader from './sections/DashboardHeader';
import OverviewSection from './sections/OverViewSection';
import AdminInsightsSection from './sections/AdminInsightsSection';
import MemberInsightsSection from './sections/MemberInsightsSection';
import SuperAdminInsightsSection from './sections/SuperAdminInsightsSection';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";
  const isMember = user?.role === "member";

  const getDashboardData = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OBTENER_DASHBOARD);

      const data = response.data;

      setTimeout(() => {
        setDashboardData(data);
        setLoading(false);
      }, 1200);

    } catch (error) {
      error.response?.data?.message ||
        "Error al cargar dashboard"
      
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
        <DashboardHeader user={user} loading={loading} />

        <OverviewSection stats={dashboardData?.stats} loading={loading} />

        {isSuperAdmin && (
          <SuperAdminInsightsSection
            tagUsage={dashboardData?.tagUsage || []}
            stats={dashboardData?.stats}
            loading={loading}
          />
        )}

        {isAdmin && (
          <AdminInsightsSection
            tagUsage={dashboardData?.tagUsage || []}
            topPosts={dashboardData?.topPosts || []}
            stats={dashboardData?.stats}
            comments={dashboardData?.recentComments || []}
            loading={loading}
          />
        )}

        {isMember && (
          <MemberInsightsSection
            saved={dashboardData?.recentSaved || []}
            feedbacks={dashboardData?.recentFeedbacks || []}
            stats={dashboardData?.stats}
            loading={loading}
          />
        )}
      </>
    </DashboardLayout>
  )
}

export default Dashboard