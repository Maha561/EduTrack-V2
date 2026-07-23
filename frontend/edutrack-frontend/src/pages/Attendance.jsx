import React, { useState, useEffect } from "react";
import attendanceService from "../services/attendanceService";
import studentService from "../services/studentService";
import { Plus, Check, X, Calendar } from "lucide-react";
import "../App.css";

function Attendance({ role, studentId }) {
    const [attendanceList, setAttendanceList] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [overallPercentage, setOverallPercentage] = useState(0);

    // Form state for Admin
    const [attendanceForm, setAttendanceForm] = useState({
        studentId: "",
        date: new Date().toISOString().split("T")[0],
        subject: "",
        status: "PRESENT",
        remarks: ""
    });

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Load global or student attendance
            const allLogs = await attendanceService.getAllAttendance();
            
            if (role === "ADMIN") {
                setAttendanceList(allLogs.reverse()); // latest first
                const studentsData = await studentService.getAllStudents();
                setStudents(studentsData);
                if (studentsData.length > 0) {
                    setAttendanceForm(prev => ({
                        ...prev,
                        studentId: studentsData[0].id.toString()
                    }));
                }
            } else {
                // Student mode
                const studentLogs = allLogs.filter(log => log.student && log.student.id === studentId);
                setAttendanceList(studentLogs.reverse());

                const pct = await attendanceService.getAttendancePercentage(studentId);
                setOverallPercentage(pct || 0);
            }
        } catch (error) {
            console.error("Error loading attendance records", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAttendanceForm({
            ...attendanceForm,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!attendanceForm.subject) {
            alert("Please enter a subject name.");
            return;
        }

        try {
            const payload = {
                studentId: parseInt(attendanceForm.studentId),
                date: attendanceForm.date,
                subject: attendanceForm.subject,
                status: attendanceForm.status,
                remarks: attendanceForm.remarks
            };

            const res = await attendanceService.addAttendance(payload);
            alert(res || "Attendance recorded successfully!");
            // Reset form except student list prefill
            setAttendanceForm(prev => ({
                ...prev,
                subject: "",
                remarks: ""
            }));
            loadData();
        } catch (error) {
            alert("Failed to save attendance record.");
        }
    };

    return (
        <div className="attendance-page">
            {role === "ADMIN" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {/* Add Attendance Section */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>Log Student Attendance</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Select Student</label>
                                    <select
                                        name="studentId"
                                        value={attendanceForm.studentId}
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
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={attendanceForm.date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Subject / Class Course</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={attendanceForm.subject}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Mathematics II, Computer Networks"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Attendance Status</label>
                                    <select
                                        name="status"
                                        value={attendanceForm.status}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="PRESENT">Present</option>
                                        <option value="ABSENT">Absent</option>
                                    </select>
                                </div>

                                <div className="form-group form-grid-full">
                                    <label>Remarks (Optional)</label>
                                    <input
                                        type="text"
                                        name="remarks"
                                        value={attendanceForm.remarks}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="e.g. Late by 10 mins, Excused leave"
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={18} /> Submit Attendance
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Global Log Table */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>All Logged Attendance Records</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Roll Number</th>
                                        <th>Student Name</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                                Loading attendance list...
                                            </td>
                                        </tr>
                                    ) : attendanceList.length > 0 ? (
                                        attendanceList.map((log) => (
                                            <tr key={log.id}>
                                                <td style={{ fontWeight: "600" }}>{log.date}</td>
                                                <td style={{ fontWeight: "700" }}>{log.student?.rollNumber}</td>
                                                <td>{log.student?.user?.name}</td>
                                                <td style={{ fontWeight: "600" }}>{log.subject}</td>
                                                <td>
                                                    <span className={`badge-status ${log.status === "PRESENT" ? "badge-present" : "badge-absent"}`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontStyle: log.remarks ? "normal" : "italic", color: log.remarks ? "#475569" : "#94a3b8" }}>
                                                    {log.remarks || "No remarks"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                No attendance logs found in database.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // Student View
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Gauge/Overview Card */}
                    <div 
                        className="dashboard-section"
                        style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            flexWrap: "wrap",
                            gap: "24px"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div 
                                style={{ 
                                    width: "80px", 
                                    height: "80px", 
                                    borderRadius: "50%", 
                                    backgroundColor: overallPercentage >= 75 ? "#ecfdf5" : "#fef2f2", 
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    border: `4px solid ${overallPercentage >= 75 ? "#10b981" : "#ef4444"}`
                                }}
                            >
                                <strong style={{ fontSize: "18px", color: overallPercentage >= 75 ? "#065f46" : "#991b1b" }}>
                                    {overallPercentage.toFixed(0)}%
                                </strong>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: "700", color: "#0f172a" }}>My Overall Attendance Rate</h3>
                                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b" }}>
                                    {overallPercentage >= 75 
                                        ? "Great job! Your attendance is above the required 75% threshold."
                                        : "Warning! Your attendance is below 75%. You might be at academic risk."
                                    }
                                </p>
                            </div>
                        </div>
                        <div>
                            <span 
                                className={`badge-status ${overallPercentage >= 75 ? "badge-present" : "badge-absent"}`}
                                style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "13px" }}
                            >
                                {overallPercentage >= 75 ? "Satisfactory" : "Low Attendance"}
                            </span>
                        </div>
                    </div>

                    {/* Personal Logs Table */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>My Attendance History Logs</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Subject Course</th>
                                        <th>Class Status</th>
                                        <th>Instructor Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                                Loading your logs...
                                            </td>
                                        </tr>
                                    ) : attendanceList.length > 0 ? (
                                        attendanceList.map((log) => (
                                            <tr key={log.id}>
                                                <td style={{ fontWeight: "600" }}>{log.date}</td>
                                                <td style={{ fontWeight: "600", color: "#0f172a" }}>{log.subject}</td>
                                                <td>
                                                    <span className={`badge-status ${log.status === "PRESENT" ? "badge-present" : "badge-absent"}`}>
                                                        {log.status === "PRESENT" ? "Attended" : "Absent"}
                                                    </span>
                                                </td>
                                                <td style={{ fontStyle: log.remarks ? "normal" : "italic", color: log.remarks ? "#475569" : "#94a3b8" }}>
                                                    {log.remarks || "No remarks logged"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                No attendance logs registered for your account.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Attendance;
