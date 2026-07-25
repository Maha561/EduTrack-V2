import axiosInstance from "../api/axiosConfig";

const attendanceService = {
    addAttendance: async (attendanceData) => {
        const response = await axiosInstance.post("/attendance", attendanceData);
        return response.data;
    },

    getAllAttendance: async () => {
        const response = await axiosInstance.get("/attendance");
        return response.data;
    },

    getAttendancePercentage: async (studentId) => {
        const response = await axiosInstance.get(`/attendance/percentage/${studentId}`);
        return response.data;
    }
};

export default attendanceService;
