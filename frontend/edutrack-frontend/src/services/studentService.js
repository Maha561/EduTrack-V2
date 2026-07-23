import axiosInstance from "../api/axiosConfig";

const studentService = {
    getAllStudents: async () => {
        const response = await axiosInstance.get("/students");
        return response.data;
    },

    getStudentById: async (id) => {
        const response = await axiosInstance.get(`/students/${id}`);
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await axiosInstance.post("/students", studentData);
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await axiosInstance.put(`/students/${id}`, studentData);
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await axiosInstance.delete(`/students/${id}`);
        return response.data;
    }
};

export default studentService;
