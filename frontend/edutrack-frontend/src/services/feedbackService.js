import axiosInstance from "../api/axiosConfig";

const feedbackService = {
    addFeedback: async (feedbackData) => {
        const response = await axiosInstance.post("/feedback", feedbackData);
        return response.data;
    },

    getAllFeedback: async () => {
        const response = await axiosInstance.get("/feedback");
        return response.data;
    }
};

export default feedbackService;
