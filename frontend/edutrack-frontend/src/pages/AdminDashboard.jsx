import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import AuthService from "../services/AuthService";
import DashboardService from "../services/DashboardService";
import studentService from "../services/studentService";
import attendanceService from "../services/attendanceService";
import feedbackService from "../services/feedbackService";
import achievementService from "../services/achievementService";

import Students from "./Students";
import Attendance from "./Attendance";
import Marks from "./Marks";
import Achievements from "./Achievements";
import Feedback from "./Feedback";

import { Users, Calendar, Award, MessageSquare } from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import "../App.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({
        totalStudents: 0,
        averageAttendance: 0,
        totalAchievements: 0
    });
    const [departmentData, setDepartmentData] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [recentAchievements, setRecentAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const user = AuthService.getCurrentUser();

    useEffect(() => {
        if (!AuthService.isAuthenticated() || (user && user.role !== "ADMIN")) {
            navigate("/login");
            return;
        }

        fetchDashboardData();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Get Overview stats
            const statsRes = await DashboardService.getAdminDashboard();
            setStats({
                totalStudents: statsRes.totalStudents || 0,
                averageAttendance: statsRes.averageAttendance || 0,
                totalAchievements: statsRes.totalAchievements || 0
            });

            // Get students to group by department dynamically
            const studentsList = await studentService.getAllStudents();
            const deptCounts = {};
            studentsList.forEach(s => {
                const dept = s.department || "Unknown";
                deptCounts[dept] = (deptCounts[dept] || 0) + 1;
            });
            const formattedDeptData = Object.keys(deptCounts).map(key => ({
                name: key,
                Students: deptCounts[key]
            }));
            setDepartmentData(formattedDeptData);

            // Get recent feedback
            const feedbackList = await feedbackService.getAllFeedback();
            // Sort by feedbackDate descending or id descending, get top 3
            const sortedFeedback = [...feedbackList]
                .reverse()
                .slice(0, 3);
            setRecentFeedback(sortedFeedback);

            // Get recent achievements
            const achList = await achievementService.getAllAchievements();
            const sortedAch = [...achList]
                .reverse()
                .slice(0, 3);
            setRecentAchievements(sortedAch);

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case "students":
                return <Students />;
            case "attendance":
                return <Attendance role="ADMIN" />;
            case "marks":
                return <Marks role="ADMIN" />;
            case "achievements":
                return <Achievements role="ADMIN" />;
            case "feedback":
                return <Feedback role="ADMIN" />;
            case "overview":
            default:
                return (
                    <div className="admin-overview">
                        {/* Stats Cards Row */}
                        <div className="stat-cards-grid">
                            <DashboardCard 
                                label="Total Students" 
                                value={stats.totalStudents} 
                                icon={<Users size={24} />} 
                                color="blue" 
                            />
                            <DashboardCard 
                                label="Avg. Attendance" 
                                value={`${stats.averageAttendance.toFixed(1)}%`} 
                                icon={<Calendar size={24} />} 
                                color="emerald" 
                            />
                            <DashboardCard 
                                label="Achievements logged" 
                                value={stats.totalAchievements} 
                                icon={<Award size={24} />} 
                                color="amber" 
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="stat-cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
                            {/* Department enrollment bar chart */}
                            <div className="dashboard-section">
                                <div className="dashboard-section-header">
                                    <h2>Department Distribution</h2>
                                </div>
                                <div className="chart-container-card">
                                    {departmentData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={departmentData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "10px" }}
                                                />
                                                <Legend />
                                                <Bar dataKey="Students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#64748b" }}>
                                            No students found to map departments.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Academic activity or summary statistics */}
                            <div className="dashboard-section">
                                <div className="dashboard-section-header">
                                    <h2>Recent Achievements</h2>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {recentAchievements.length > 0 ? (
                                        recentAchievements.map((ach) => (
                                            <div 
                                                key={ach.id} 
                                                style={{ 
                                                    padding: "14px 18px", 
                                                    backgroundColor: "#f8fafc", 
                                                    border: "1px solid #e2e8f0", 
                                                    borderRadius: "12px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "6px"
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <strong style={{ color: "#0f172a", fontSize: "14px" }}>
                                                        {ach.student ? ach.student.user.name : "Student"} ({ach.achievementType})
                                                    </strong>
                                                    <span style={{ fontSize: "11px", color: "#64748b" }}>{ach.achievementDate}</span>
                                                </div>
                                                <span style={{ fontSize: "13px", color: "#475569" }}>{ach.description}</span>
                                                <span style={{ fontSize: "11px", fontWeight: "600", color: "#2563eb" }}>Event: {ach.batchName}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: "center", color: "#64748b", padding: "24px" }}>
                                            No achievements logged yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Feedback & Logs */}
                        <div className="dashboard-section">
                            <div className="dashboard-section-header">
                                <h2>Recent Feedback Log</h2>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Category</th>
                                            <th>Feedback Title</th>
                                            <th>Given By</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentFeedback.length > 0 ? (
                                            recentFeedback.map((f) => (
                                                <tr key={f.id}>
                                                    <td style={{ fontWeight: "600" }}>{f.student ? f.student.user.name : "N/A"}</td>
                                                    <td>
                                                        <span className="badge-status" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
                                                            {f.category}
                                                        </span>
                                                    </td>
                                                    <td>{f.title}</td>
                                                    <td>{f.givenBy}</td>
                                                    <td>{f.feedbackDate}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: "center", color: "#64748b" }}>
                                                    No feedback submissions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} role="ADMIN" email={user.email}>
            {isLoading && activeTab === "overview" ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", color: "#2563eb", fontWeight: "600" }}>
                    Loading statistics...
                </div>
            ) : (
                renderTabContent()
            )}
        </Layout>
    );
}

export default AdminDashboard;
