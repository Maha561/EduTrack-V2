import axiosInstance from "../api/axiosConfig";

const smartInsightService = {
    generateInsight: async (studentId) => {
        const response = await axiosInstance.post(`/insights/generate/${studentId}`);
        return response.data;
    },

    getInsights: async (studentId) => {
        const response = await axiosInstance.get(`/insights/${studentId}`);
        return response.data;
    }
};

export default smartInsightService;
