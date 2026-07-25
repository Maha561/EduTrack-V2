import React from "react";
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Award, 
    MessageSquare, 
    Sparkles, 
    LogOut,
    GraduationCap
} from "lucide-react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

function Sidebar({ activeTab, setActiveTab, role }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    const adminLinks = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "students", label: "Students", icon: <Users size={20} /> },
        { id: "attendance", label: "Attendance", icon: <Calendar size={20} /> },
        { id: "marks", label: "Marks Entry", icon: <Award size={20} /> }, // Award serves as marks icon
        { id: "achievements", label: "Achievements", icon: <Award size={20} /> },
        { id: "feedback", label: "Feedback", icon: <MessageSquare size={20} /> },
    ];

    const studentLinks = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "attendance", label: "My Attendance", icon: <Calendar size={20} /> },
        { id: "marks", label: "My Grades", icon: <Award size={20} /> },
        { id: "achievements", label: "My Achievements", icon: <Award size={20} /> },
        { id: "feedback", label: "Feedback Log", icon: <MessageSquare size={20} /> },
        { id: "insights", label: "Smart Insights", icon: <Sparkles size={20} /> },
    ];

    const links = role === "ADMIN" ? adminLinks : studentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="logo-box">
                    <GraduationCap size={24} className="brand-icon" />
                </div>
                <div className="brand-text">
                    <h3>EduTrack</h3>
                    <span>{role === "ADMIN" ? "Admin Panel" : "Student Hub"}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <button
                        key={link.id}
                        className={`nav-item ${activeTab === link.id ? "active" : ""}`}
                        onClick={() => setActiveTab(link.id)}
                    >
                        <span className="nav-icon">{link.icon}</span>
                        <span className="nav-label">{link.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout}>
                    <span className="nav-icon"><LogOut size={20} /></span>
                    <span className="nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
