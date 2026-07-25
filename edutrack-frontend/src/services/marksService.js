import axiosInstance from "../api/axiosConfig";

const marksService = {
    addMarks: async (marksData) => {
        const response = await axiosInstance.post("/marks", marksData);
        return response.data;
    },

    getAllMarks: async () => {
        const response = await axiosInstance.get("/marks");
        return response.data;
    },

    getMarksById: async (id) => {
        const response = await axiosInstance.get(`/marks/${id}`);
        return response.data;
    },

    updateMarks: async (id, marksData) => {
        const response = await axiosInstance.put(`/marks/${id}`, marksData);
        return response.data;
    },

    deleteMarks: async (id) => {
        const response = await axiosInstance.delete(`/marks/${id}`);
        return response.data;
    }
};

export default marksService;
