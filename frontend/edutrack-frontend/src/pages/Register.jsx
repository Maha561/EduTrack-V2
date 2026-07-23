import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({

        username: "",
        email: "",
        password: "",
        role: "STUDENT"

    });

    const handleChange = (e) => {

        setRegisterData({

            ...registerData,

            [e.target.name]: e.target.value

        });

    };

    const handleRegister = async () => {

        try {

            await AuthService.register({
                username: registerData.username,
                email: registerData.email,
                password: registerData.password
            });

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {

            alert("Registration Failed");

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                <h1>Create EduTrack Account</h1>

                <p>
                    Join EduTrack to access student analytics
                </p>

                <label>Full Name</label>

                <input
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />

                <label>Email</label>

                <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                />

                <label>Password</label>

                <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                />

                <label>Account Type</label>

                <select
                    name="role"
                    value={registerData.role}
                    onChange={handleChange}
                >

                    <option value="STUDENT">
                        Student
                    </option>

                    <option value="ADMIN">
                        Admin
                    </option>

                </select>

                <button
                    className="login-btn"
                    onClick={handleRegister}
                >
                    Create Account →
                </button>

                <Link
                    className="register-link"
                    to="/login"
                >
                    Already have an account? Sign In
                </Link>

            </div>

        </div>

    );

}

export default Register;