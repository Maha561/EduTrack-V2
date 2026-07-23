import axiosInstance from "../api/axiosConfig";


const AuthService = {


    login: (data) => {

        return axiosInstance.post(
            "/login",
            data
        );

    }


};


export default AuthService;