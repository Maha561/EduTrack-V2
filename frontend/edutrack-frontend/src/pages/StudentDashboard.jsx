import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import AuthService from "../services/AuthService";
import DashboardService from "../services/DashboardService";
import studentService from "../services/studentService";
import marksService from "../services/marksService";
import feedbackService from "../services/feedbackService";
import achievementService from "../services/achievementService";

import Attendance from "./Attendance";
import Marks from "./Marks";
import Achievements from "./Achievements";
import Feedback from "./Feedback";
import SmartInsights from "./SmartInsights";

import { Calendar, Award, BookOpen, AlertCircle } from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer
} from "recharts";
import "../App.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [studentId, setStudentId] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null);
    const [stats, setStats] = useState({
        attendancePercentage: 0,
        achievementCount: 0
    });
    const [marksData, setMarksData] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profileError, setProfileError] = useState(false);

    const user = AuthService.getCurrentUser();

    useEffect(() => {
        if (!AuthService.isAuthenticated() || (user && user.role !== "STUDENT")) {
            navigate("/login");
            return;
        }

        resolveStudentIdAndFetch();
    }, [activeTab]);

    const resolveStudentIdAndFetch = async () => {
        setIsLoading(true);
        try {
            const email = localStorage.getItem("userEmail");
            const studentsList = await studentService.getAllStudents();
            const currentStudent = studentsList.find(s => s.user && s.user.email === email);

            if (currentStudent) {
                setStudentId(currentStudent.id);
                setStudentDetails(currentStudent);
                localStorage.setItem("studentId", currentStudent.id);
                localStorage.setItem("studentName", currentStudent.user.name);

                // Fetch student specific dashboard stats
                const statsRes = await DashboardService.getStudentDashboard(currentStudent.id);
                setStats({
                    attendancePercentage: statsRes.attendancePercentage || 0,
                    achievementCount: statsRes.achievementCount || 0
                });

                // Fetch student marks for chart
                const allMarks = await marksService.getAllMarks();
                const studentMarks = allMarks.filter(m => m.student && m.student.id === currentStudent.id);
                const formattedMarks = studentMarks.map(m => ({
                    subject: m.subject,
                    Internal: m.internalMarks,
                    External: m.externalMarks,
                    Total: m.totalMarks
                }));
                setMarksData(formattedMarks);

                // Fetch feedback
                const allFeedback = await feedbackService.getAllFeedback();
                const studentFeedback = allFeedback
                    .filter(f => f.student && f.student.id === currentStudent.id)
                    .reverse()
                    .slice(0, 3);
                setRecentFeedback(studentFeedback);

                setProfileError(false);
            } else {
                setProfileError(true);
            }
        } catch (error) {
            console.error("Error loading student dashboard details", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    if (profileError) {
        return (
            <div className="login-page" style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="login-card" style={{ maxWidth: "500px", textAlign: "center", padding: "32px" }}>
                    <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto 16px auto" }} />
                    <h2 style={{ color: "#0f172a", marginBottom: "12px", fontSize: "20px" }}>Profile Pending Registration</h2>
                    <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                        Welcome to EduTrack, <strong>{user.email}</strong>!
                        <br />
                        Your student academic profile has not been set up in the directory by an administrator yet. 
                        Please contact the department admin to register your roll number and details.
                    </p>
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => { AuthService.logout(); navigate("/login"); }}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        Back to Login Portal
                    </button>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "attendance":
                return <Attendance role="STUDENT" studentId={studentId} />;
            case "marks":
                return <Marks role="STUDENT" studentId={studentId} />;
            case "achievements":
                return <Achievements role="STUDENT" studentId={studentId} />;
            case "feedback":
                return <Feedback role="STUDENT" studentId={studentId} />;
            case "insights":
                return <SmartInsights studentId={studentId} />;
            case "overview":
            default:
                return (
                    <div className="student-overview">
                        {/* Student Info Card */}
                        <div 
                            className="dashboard-section" 
                            style={{ 
                                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                                color: "#ffffff",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "20px"
                            }}
                        >
                            <div>
                                <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700" }}>
                                    {studentDetails?.user?.name || "Student"}
                                </h2>
                                <p style={{ color: "#bfdbfe", fontSize: "14px", marginTop: "4px" }}>
                                    Roll Number: {studentDetails?.rollNumber} | Department: {studentDetails?.department}
                                </p>
                                <p style={{ color: "#93c5fd", fontSize: "13px", marginTop: "4px" }}>
                                    Year: {studentDetails?.year} | Semester: {studentDetails?.semester} | Section: {studentDetails?.section}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ display: "block", fontSize: "12px", color: "#93c5fd", textTransform: "uppercase" }}>Phone Number</span>
                                    <strong style={{ fontSize: "15px" }}>{studentDetails?.phone}</strong>
                                </div>
                                <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,0.2)", paddingLeft: "16px" }}>
                                    <span style={{ display: "block", fontSize: "12px", color: "#93c5fd", textTransform: "uppercase" }}>Parent Contact</span>
                                    <strong style={{ fontSize: "15px" }}>{studentDetails?.parentName}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="stat-cards-grid">
                            <DashboardCard 
                                label="My Attendance Rate" 
                                value={`${stats.attendancePercentage.toFixed(1)}%`} 
                                icon={<Calendar size={24} />} 
                                color={stats.attendancePercentage >= 75 ? "emerald" : "rose"} 
                            />
                            <DashboardCard 
                                label="Academic Achievements" 
                                value={stats.achievementCount} 
                                icon={<Award size={24} />} 
                                color="amber" 
                            />
                            <DashboardCard 
                                label="Enrolled Semester" 
                                value={`Sem ${studentDetails?.semester || 1}`} 
                                icon={<BookOpen size={24} />} 
                                color="indigo" 
                            />
                        </div>

                        {/* Chart Grid */}
                        <div className="stat-cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
                            {/* Grades Bar Chart */}
                            <div className="dashboard-section">
                                <div className="dashboard-section-header">
                                    <h2>My Grades Breakdown</h2>
                                </div>
                                <div className="chart-container-card">
                                    {marksData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={marksData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="subject" />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc", borderRadius: "10px" }}
                                                />
                                                <Legend />
                                                <Bar dataKey="Internal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="External" fill="#10b981" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#64748b" }}>
                                            No grade records logged yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Instructor Feedback */}
                            <div className="dashboard-section">
                                <div className="dashboard-section-header">
                                    <h2>Instructor Feedback Logs</h2>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {recentFeedback.length > 0 ? (
                                        recentFeedback.map((f) => (
                                            <div 
                                                key={f.id} 
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
                                                    <span className="badge-status" style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "11px" }}>
                                                        {f.category}
                                                    </span>
                                                    <span style={{ fontSize: "11px", color: "#64748b" }}>{f.feedbackDate}</span>
                                                </div>
                                                <strong style={{ color: "#0f172a", fontSize: "14px" }}>{f.title}</strong>
                                                <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>{f.message}</p>
                                                <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic" }}>By: {f.givenBy}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: "center", color: "#64748b", padding: "24px" }}>
                                            No feedback logged yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} role="STUDENT" email={user.email}>
            {isLoading && activeTab === "overview" ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", color: "#2563eb", fontWeight: "600" }}>
                    Loading profile details...
                </div>
            ) : (
                renderTabContent()
            )}
        </Layout>
    );
}

export default StudentDashboard;
