import axiosInstance from "../api/axiosConfig";

const DashboardService = {
    getAdminDashboard: async () => {
        const response = await axiosInstance.get("/dashboard/admin");
        return response.data;
    },

    getStudentDashboard: async (studentId) => {
        const response = await axiosInstance.get(`/dashboard/student/${studentId}`);
        return response.data;
    }
};

export default DashboardService;
