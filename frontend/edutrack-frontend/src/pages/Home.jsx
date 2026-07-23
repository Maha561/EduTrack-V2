import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import AuthService from "../services/AuthService";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const [demoRole, setDemoRole] = useState("ADMIN");
    const [email, setEmail] = useState("admin@edutrack.edu");
    const [password, setPassword] = useState("admin123");
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChange = (role) => {
        setDemoRole(role);
        if (role === "ADMIN") {
            setEmail("admin@edutrack.edu");
            setPassword("admin123");
        } else {
            setEmail("maha2@gmail.com");
            setPassword("12345");
        }
    };

    const handleQuickSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await AuthService.login({
                email,
                password,
                role: demoRole
            });
            if (res === "Login successful") {
                if (demoRole === "ADMIN") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/student-dashboard");
                }
            } else {
                alert(`Error: ${res}`);
            }
        } catch (err) {
            alert("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="landing-page">
            <Navbar />

            <div className="hero">
                {/* LEFT SECTION */}
                <div className="hero-left">
                    <span className="badge">
                        <Sparkles size={14} className="badge-spark" />
                        Intelligent analytics for modern universities
                    </span>

                    <h1>
                        Smart student
                        <br />
                        <span className="highlight">analytics</span> &
                        <br />
                        academic
                        <br />
                        management
                    </h1>

                    <p>
                        EduTrack helps colleges monitor performance,
                        attendance, and student risk with a unified dashboard
                        for administrators and students, powered by predictive insights.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/login" className="link-btn">
                            <button className="primary-btn">
                                Access Dashboard <ArrowRight size={18} />
                            </button>
                        </Link>
                        <a href="#features" className="explore-link">
                            <button className="secondary-btn">
                                Explore Modules
                            </button>
                        </a>
                    </div>

                    <div className="stats">
                        <div className="stat-item">
                            <h2>12k+</h2>
                            <p>Students Managed</p>
                        </div>
                        <div className="stat-item">
                            <h2>94%</h2>
                            <p>Retention Rate</p>
                        </div>
                        <div className="stat-item">
                            <h2>24/7</h2>
                            <p>Automated Insights</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="hero-right">
                    <div className="login-card-container">
                        <div className="login-card">
                            <div className="card-header">
                                <ShieldCheck size={28} className="shield-icon" />
                                <div>
                                    <h2>Demo Login Portal</h2>
                                    <p>Select role to sign in instantly</p>
                                </div>
                            </div>

                            <form onSubmit={handleQuickSignIn}>
                                <div className="toggle">
                                    <button
                                        type="button"
                                        className={demoRole === "ADMIN" ? "active" : ""}
                                        onClick={() => handleRoleChange("ADMIN")}
                                    >
                                        Administrator
                                    </button>
                                    <button
                                        type="button"
                                        className={demoRole === "STUDENT" ? "active" : ""}
                                        onClick={() => handleRoleChange("STUDENT")}
                                    >
                                        Student
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label>Demo Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        disabled
                                        className="prefilled-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Demo Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        readOnly
                                        disabled
                                        className="prefilled-input"
                                    />
                                </div>

                                <button type="submit" className="signin-btn" disabled={isLoading}>
                                    {isLoading ? "Signing in..." : `Sign in as ${demoRole === "ADMIN" ? "Admin" : "Student"}`}
                                </button>
                            </form>

                            <div className="demo-credentials-note">
                                <CheckCircle2 size={14} /> Pre-seeded demo credentials ready.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div id="features">
                <Features />
            </div>
            <Footer />
        </div>
    );
}

export default Home;