import axiosInstance from "../api/axiosConfig";

const achievementService = {
    addAchievement: async (achievementData) => {
        const response = await axiosInstance.post("/achievements", achievementData);
        return response.data;
    },

    getAllAchievements: async () => {
        const response = await axiosInstance.get("/achievements");
        return response.data;
    }
};

export default achievementService;
