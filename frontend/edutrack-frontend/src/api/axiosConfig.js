import axios from "axios";

const axiosInstance = axios.create({
   baseURL: "https://edutrack-v2-i41c.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;