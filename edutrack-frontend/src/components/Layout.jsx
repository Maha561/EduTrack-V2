import React from "react";
import Sidebar from "./Sidebar";
import { User, Bell } from "lucide-react";
import "./Layout.css";

function Layout({ children, activeTab, setActiveTab, role, email }) {
    // Generate page title based on active tab
    const getPageTitle = () => {
        switch (activeTab) {
            case "overview": return "Dashboard Overview";
            case "students": return "Student Directory";
            case "attendance": return role === "ADMIN" ? "Attendance Logging" : "My Attendance History";
            case "marks": return role === "ADMIN" ? "Grades & Marks Entry" : "My Academic Grades";
            case "achievements": return role === "ADMIN" ? "Achievements Tracking" : "My Achievements & Certifications";
            case "feedback": return role === "ADMIN" ? "Student Feedback Management" : "Instructor Feedback Logs";
            case "insights": return "AI Smart Insights";
            default: return "Dashboard";
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} />
            
            <div className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>{getPageTitle()}</h1>
                        <p className="subtitle">Welcome back, {email.split("@")[0]}!</p>
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn" title="Notifications">
                            <Bell size={20} />
                            <span className="badge"></span>
                        </button>
                        
                        <div className="user-profile-badge">
                            <div className="profile-icon">
                                <User size={18} />
                            </div>
                            <div className="profile-details">
                                <span className="profile-name">{email.split("@")[0]}</span>
                                <span className="profile-role">{role}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
