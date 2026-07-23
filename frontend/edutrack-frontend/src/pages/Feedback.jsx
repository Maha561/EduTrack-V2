import React, { useState, useEffect } from "react";
import feedbackService from "../services/feedbackService";
import studentService from "../services/studentService";
import { Plus, MessageSquare, Send, Calendar, User } from "lucide-react";
import "../App.css";

function Feedback({ role, studentId }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state (Admin logs feedback, Student logs self-complaint)
    const [form, setForm] = useState({
        studentId: "",
        category: "Academic Performance",
        title: "",
        message: "",
        givenBy: role === "ADMIN" ? "Administrator" : "STUDENT",
        feedbackDate: new Date().toISOString().split("T")[0]
    });

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const allFeedback = await feedbackService.getAllFeedback();
            if (role === "ADMIN") {
                setFeedbackList(allFeedback.reverse());
                const studentsData = await studentService.getAllStudents();
                setStudents(studentsData);
                if (studentsData.length > 0) {
                    setForm(prev => ({
                        ...prev,
                        studentId: studentsData[0].id.toString()
                    }));
                }
            } else {
                const studentFbs = allFeedback.filter(f => f.student && f.student.id === studentId);
                setFeedbackList(studentFbs.reverse());
                setForm(prev => ({
                    ...prev,
                    studentId: studentId.toString()
                }));
            }
        } catch (error) {
            console.error("Error loading feedback list", error);
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
        if (!form.title || !form.message) {
            alert("Please fill in the title and message fields.");
            return;
        }

        try {
            const payload = {
                ...form,
                studentId: parseInt(form.studentId)
            };

            const res = await feedbackService.addFeedback(payload);
            alert(res || "Feedback submitted successfully!");
            setForm(prev => ({
                ...prev,
                title: "",
                message: "",
                givenBy: role === "ADMIN" ? "Administrator" : "STUDENT"
            }));
            loadData();
        } catch (error) {
            alert("Failed to submit feedback.");
        }
    };

    return (
        <div className="feedback-page">
            {role === "ADMIN" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {/* Add Feedback */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>Write Academic & Behavioral Feedback</h2>
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
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="Academic Performance">Academic Performance</option>
                                        <option value="Discipline & Behavior">Discipline & Behavior</option>
                                        <option value="Attendance Warning">Attendance Warning</option>
                                        <option value="General Counselling">General Counselling</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Feedback Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Inconsistent Class participation"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Given By / Author</label>
                                    <input
                                        type="text"
                                        name="givenBy"
                                        value={form.givenBy}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Professor Smith"
                                        required
                                    />
                                </div>

                                <div className="form-group form-grid-full">
                                    <label>Detailed Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="3"
                                        placeholder="Enter behavioral feedback or counseling message..."
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn btn-primary">
                                    <Send size={18} /> Send Feedback
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Global Feedback Log */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>All Feedback Records</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                            {isLoading ? (
                                <div style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                    Loading feedback logs...
                                </div>
                            ) : feedbackList.length > 0 ? (
                                feedbackList.map((f) => (
                                    <div 
                                        key={f.id}
                                        style={{ 
                                            padding: "20px", 
                                            backgroundColor: "#f8fafc", 
                                            border: "1px solid #e2e8f0", 
                                            borderRadius: "16px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                                                    {f.title}
                                                </h3>
                                                <span style={{ fontSize: "13px", color: "#64748b" }}>
                                                    Student: <strong>{f.student?.user?.name}</strong> ({f.student?.rollNumber})
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <span className="badge-status" style={{ backgroundColor: "#eff6ff", color: "#2563eb", fontSize: "11px" }}>
                                                    {f.category}
                                                </span>
                                                <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <Calendar size={13} /> {f.feedbackDate}
                                                </span>
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                                            {f.message}
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                                            <User size={13} /> Logged by: <strong>{f.givenBy}</strong>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                    No feedback logged.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // Student View
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "start" }}>
                    {/* Submit self inquiry / complaint */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>Submit Inquiries / Requests</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="Academic Performance">Academic Inquiry</option>
                                    <option value="General Counselling">Grievance / Complaint</option>
                                    <option value="Attendance Warning">Attendance Query</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Subject / Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Brief subject of query"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "12px" }}>
                                <label>Sender Identity</label>
                                <select
                                    name="givenBy"
                                    value={form.givenBy}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="STUDENT">Student (Self)</option>
                                    <option value="PARENT">Parent/Guardian</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "16px" }}>
                                <label>Detailed Description</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Explain your academic request or complaint in detail..."
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                                <Send size={16} /> Submit Query
                            </button>
                        </form>
                    </div>

                    {/* Personal Logs List */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>My Feedback Logs</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                            {isLoading ? (
                                <div style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                    Loading logs...
                                </div>
                            ) : feedbackList.length > 0 ? (
                                feedbackList.map((f) => (
                                    <div 
                                        key={f.id}
                                        style={{ 
                                            padding: "16px", 
                                            backgroundColor: "#f8fafc", 
                                            border: "1px solid #e2e8f0", 
                                            borderRadius: "12px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px"
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span 
                                                className="badge-status" 
                                                style={{ 
                                                    backgroundColor: f.givenBy === "STUDENT" || f.givenBy === "PARENT" ? "#f1f5f9" : "#ecfdf5", 
                                                    color: f.givenBy === "STUDENT" || f.givenBy === "PARENT" ? "#475569" : "#047857",
                                                    fontSize: "11px" 
                                                }}
                                            >
                                                {f.category}
                                            </span>
                                            <span style={{ fontSize: "11px", color: "#64748b" }}>{f.feedbackDate}</span>
                                        </div>
                                        <strong style={{ color: "#0f172a", fontSize: "14px" }}>{f.title}</strong>
                                        <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                                            {f.message}
                                        </p>
                                        <span style={{ fontSize: "11px", color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: "6px" }}>
                                            Author: {f.givenBy === "STUDENT" || f.givenBy === "PARENT" ? "Self (Submitted)" : f.givenBy}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: "center", color: "#64748b", padding: "32px 16px" }}>
                                    <MessageSquare size={36} style={{ color: "#cbd5e1", marginBottom: "8px" }} />
                                    <p style={{ margin: 0, fontSize: "14px" }}>No feedback entries logged for you.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feedback;
