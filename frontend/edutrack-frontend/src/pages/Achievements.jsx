import React, { useState, useEffect } from "react";
import achievementService from "../services/achievementService";
import studentService from "../services/studentService";
import { Plus, Award, Calendar, CheckCircle } from "lucide-react";
import "../App.css";

function Achievements({ role, studentId }) {
    const [achievementsList, setAchievementsList] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [form, setForm] = useState({
        studentId: "",
        achievementType: "Academic Excellence",
        batchName: "",
        achievementDate: new Date().toISOString().split("T")[0],
        description: ""
    });

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await achievementService.getAllAchievements();
            if (role === "ADMIN") {
                setAchievementsList(data.reverse());
                const studentsData = await studentService.getAllStudents();
                setStudents(studentsData);
                if (studentsData.length > 0) {
                    setForm(prev => ({
                        ...prev,
                        studentId: studentsData[0].id.toString()
                    }));
                }
            } else {
                const studentAchs = data.filter(a => a.student && a.student.id === studentId);
                setAchievementsList(studentAchs.reverse());
            }
        } catch (error) {
            console.error("Error loading achievements", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.batchName || !form.description) {
            alert("Please fill in all details.");
            return;
        }

        try {
            const payload = {
                ...form,
                studentId: parseInt(form.studentId)
            };
            const res = await achievementService.addAchievement(payload);
            alert(res || "Achievement logged successfully!");
            setForm(prev => ({
                ...prev,
                batchName: "",
                description: ""
            }));
            loadData();
        } catch (error) {
            alert("Failed to submit achievement.");
        }
    };

    return (
        <div className="achievements-page">
            {role === "ADMIN" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {/* Log achievements form */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>Log Student Achievement / Award</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Select Student</label>
                                    <select
                                        name="studentId"
                                        value={form.studentId}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    >
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.rollNumber} - {s.user?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Category Type</label>
                                    <select
                                        name="achievementType"
                                        value={form.achievementType}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="Academic Excellence">Academic Excellence</option>
                                        <option value="Hackathon Winner">Hackathon Winner</option>
                                        <option value="Sports Tournament">Sports Tournament</option>
                                        <option value="Technical certification">Technical certification</option>
                                        <option value="Culturals & Arts">Culturals & Arts</option>
                                        <option value="Student Leadership">Student Leadership</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Event Name / Batch Name</label>
                                    <input
                                        type="text"
                                        name="batchName"
                                        value={form.batchName}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Smart India Hackathon 2026, AWS Cloud Practitioner"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Achievement Date</label>
                                    <input
                                        type="date"
                                        name="achievementDate"
                                        value={form.achievementDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group form-grid-full">
                                    <label>Detailed Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="3"
                                        placeholder="Describe the achievement in detail (e.g. Secured 1st place out of 200 teams)"
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={18} /> Log Achievement
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Achievements List Table */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>All Logged Achievements</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Roll Number</th>
                                        <th>Student Name</th>
                                        <th>Category Type</th>
                                        <th>Event / Certification</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                                Loading achievements...
                                            </td>
                                        </tr>
                                    ) : achievementsList.length > 0 ? (
                                        achievementsList.map((ach) => (
                                            <tr key={ach.id}>
                                                <td style={{ fontWeight: "600" }}>{ach.achievementDate}</td>
                                                <td style={{ fontWeight: "700" }}>{ach.student?.rollNumber}</td>
                                                <td style={{ fontWeight: "600" }}>{ach.student?.user?.name}</td>
                                                <td>
                                                    <span className="badge-status" style={{ backgroundColor: "#fffbeb", color: "#b45309" }}>
                                                        {ach.achievementType}
                                                    </span>
                                                </td>
                                                <td style={{ fontWeight: "600" }}>{ach.batchName}</td>
                                                <td style={{ fontSize: "13px" }}>{ach.description}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                No achievements logged in database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // Student Timeline View
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>My Achievements Portfolio</h2>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: "center", padding: "40px", color: "#2563eb", fontWeight: "600" }}>
                                Loading your portfolio...
                            </div>
                        ) : achievementsList.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "16px" }}>
                                {achievementsList.map((ach) => (
                                    <div 
                                        key={ach.id}
                                        style={{ 
                                            display: "flex", 
                                            gap: "20px", 
                                            borderBottom: "1px solid #f1f5f9", 
                                            paddingBottom: "20px" 
                                        }}
                                    >
                                        <div 
                                            style={{ 
                                                width: "48px", 
                                                height: "48px", 
                                                borderRadius: "50%", 
                                                backgroundColor: "#eff6ff", 
                                                color: "#2563eb", 
                                                display: "flex", 
                                                justifyContent: "center", 
                                                alignItems: "center",
                                                flexShrink: 0
                                            }}
                                        >
                                            <Award size={24} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                                                    {ach.batchName}
                                                </h3>
                                                <span 
                                                    className="badge-status" 
                                                    style={{ backgroundColor: "#fef3c7", color: "#d97706", fontSize: "11px" }}
                                                >
                                                    {ach.achievementType}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Calendar size={13} /> {ach.achievementDate}
                                            </span>
                                            <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
                                                {ach.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "48px 24px", color: "#64748b" }}>
                                <Award size={48} style={{ color: "#cbd5e1", marginBottom: "12px" }} />
                                <h3>No achievements recorded yet</h3>
                                <p style={{ fontSize: "14px", color: "#94a3b8", marginTop: "4px" }}>
                                    Participate in hackathons, sports, or excel academically to build your portfolio.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Achievements;
