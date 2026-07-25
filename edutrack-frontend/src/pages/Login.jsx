import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { ShieldAlert, Info, ArrowLeft, GraduationCap } from "lucide-react";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState("ADMIN");
    const [email, setEmail] = useState("admin@edutrack.edu");
    const [password, setPassword] = useState("admin123");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        if (selectedRole === "ADMIN") {
            setEmail("admin@edutrack.edu");
            setPassword("admin123");
        } else {
            setEmail("maha2@gmail.com");
            setPassword("12345");
        }
        setErrorMsg("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        if (!email || !password) {
            setErrorMsg("Please enter both email and password.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await AuthService.login({
                email,
                password,
                role
            });

            if (res === "Login successful") {
                if (role === "ADMIN") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/student-dashboard");
                }
            } else {
                setErrorMsg(res || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setErrorMsg("Connection to server failed. Make sure backend is running on port 8080.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Link to="/" className="back-btn">
                <ArrowLeft size={18} /> Back to Landing Page
            </Link>

            <div className="login-card">
                <div className="login-logo">
                    <GraduationCap size={32} className="logo-icon" />
                    <h2>EduTrack</h2>
                </div>

                <h1>Welcome Back</h1>
                <p className="login-subtitle">Sign in to your EduTrack account</p>

                {errorMsg && (
                    <div className="error-alert">
                        <ShieldAlert size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className="role-switch">
                    <button
                        type="button"
                        className={role === "ADMIN" ? "active" : ""}
                        onClick={() => handleRoleChange("ADMIN")}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        className={role === "STUDENT" ? "active" : ""}
                        onClick={() => handleRoleChange("STUDENT")}
                    >
                        Student
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Verifying..." : "Sign in →"}
                    </button>
                </form>

                <div className="register-redirect">
                    Don't have an account? <Link className="register-link" to="/register">Create Account</Link>
                </div>

                <div className="demo-notice">
                    <Info size={14} />
                    <span>Demo account credentials prefilled based on role switch.</span>
                </div>
            </div>
        </div>
    );
}

export default Login;