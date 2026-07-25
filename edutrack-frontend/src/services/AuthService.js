import axiosInstance from "../api/axiosConfig";

const AuthService = {
    login: async (credentials) => {
        const response = await axiosInstance.post("/login", credentials);
        if (response.data === "Login successful") {
            // Save basic info to localStorage
            localStorage.setItem("userEmail", credentials.email);
            localStorage.setItem("userRole", credentials.role);
            localStorage.setItem("isLoggedIn", "true");
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post("/register", userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
    },

    getCurrentUser: () => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) return null;
        return {
            email: localStorage.getItem("userEmail"),
            role: localStorage.getItem("userRole"),
        };
    },

    isAuthenticated: () => {
        return localStorage.getItem("isLoggedIn") === "true";
    }
};

export default AuthService;
