import React, { useState, useEffect } from "react";
import marksService from "../services/marksService";
import studentService from "../services/studentService";
import { Plus, Edit2, Trash2, X, Award } from "lucide-react";
import "../App.css";

function Marks({ role, studentId }) {
    const [marksList, setMarksList] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state for Admin edit
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedMark, setSelectedMark] = useState(null);

    // Form states
    const [marksForm, setMarksForm] = useState({
        studentId: "",
        subject: "",
        examType: "Internal Assessment 1",
        internalMarks: 0,
        externalMarks: 0,
        academicYear: "2025-2026",
        semester: 1,
        examDate: new Date().toISOString().split("T")[0],
        remarks: ""
    });

    const [editForm, setEditForm] = useState({
        studentId: "",
        subject: "",
        examType: "Internal Assessment 1",
        internalMarks: 0,
        externalMarks: 0,
        academicYear: "2025-2026",
        semester: 1,
        examDate: "",
        remarks: ""
    });

    useEffect(() => {
        loadData();
    }, [studentId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const allMarks = await marksService.getAllMarks();
            if (role === "ADMIN") {
                setMarksList(allMarks.reverse());
                const studentsData = await studentService.getAllStudents();
                setStudents(studentsData);
                if (studentsData.length > 0) {
                    setMarksForm(prev => ({
                        ...prev,
                        studentId: studentsData[0].id.toString()
                    }));
                }
            } else {
                // Student mode
                const studentMarks = allMarks.filter(m => m.student && m.student.id === studentId);
                setMarksList(studentMarks.reverse());
            }
        } catch (error) {
            console.error("Error loading marks list", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setMarksForm({
            ...marksForm,
            [name]: name === "internalMarks" || name === "externalMarks" || name === "semester" 
                ? parseInt(value) || 0
                : value
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: name === "internalMarks" || name === "externalMarks" || name === "semester"
                ? parseInt(value) || 0
                : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!marksForm.subject) {
            alert("Please enter subject name.");
            return;
        }

        try {
            const totalMarks = marksForm.internalMarks + marksForm.externalMarks;
            const payload = {
                ...marksForm,
                studentId: parseInt(marksForm.studentId),
                totalMarks
            };

            const res = await marksService.addMarks(payload);
            alert(res || "Marks recorded successfully!");
            // Reset fields
            setMarksForm(prev => ({
                ...prev,
                subject: "",
                internalMarks: 0,
                externalMarks: 0,
                remarks: ""
            }));
            loadData();
        } catch (error) {
            alert("Failed to submit marks record.");
        }
    };

    const openEditModal = (mark) => {
        setSelectedMark(mark);
        setEditForm({
            studentId: mark.student?.id.toString(),
            subject: mark.subject,
            examType: mark.examType,
            internalMarks: mark.internalMarks,
            externalMarks: mark.externalMarks,
            academicYear: mark.academicYear,
            semester: mark.semester,
            examDate: mark.examDate,
            remarks: mark.remarks || ""
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const totalMarks = editForm.internalMarks + editForm.externalMarks;
            const payload = {
                ...editForm,
                studentId: parseInt(editForm.studentId),
                totalMarks
            };

            const res = await marksService.updateMarks(selectedMark.id, payload);
            alert(res || "Grades updated successfully!");
            setIsEditOpen(false);
            loadData();
        } catch (error) {
            alert("Failed to update grades.");
        }
    };

    const handleDelete = async (id, subject, name) => {
        if (window.confirm(`Are you sure you want to delete the ${subject} grades for ${name}?`)) {
            try {
                const res = await marksService.deleteMarks(id);
                alert(res || "Record deleted successfully!");
                loadData();
            } catch (error) {
                alert("Failed to delete record.");
            }
        }
    };

    // Calculate dynamic stats for students
    const calculateAvgScore = () => {
        if (marksList.length === 0) return 0;
        const totalSum = marksList.reduce((sum, m) => sum + (m.totalMarks || 0), 0);
        return totalSum / marksList.length;
    };

    return (
        <div className="marks-page">
            {role === "ADMIN" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {/* Add Grades form */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>Log Student Grades & Marks</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Select Student</label>
                                    <select
                                        name="studentId"
                                        value={marksForm.studentId}
                                        onChange={handleAddChange}
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
                                    <label>Subject Course</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={marksForm.subject}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        placeholder="e.g. Theoretical Physics"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Examination Type</label>
                                    <select
                                        name="examType"
                                        value={marksForm.examType}
                                        onChange={handleAddChange}
                                        className="form-control"
                                    >
                                        <option value="Internal Assessment 1">Internal Assessment 1</option>
                                        <option value="Internal Assessment 2">Internal Assessment 2</option>
                                        <option value="Semester Exam">Semester Exam</option>
                                        <option value="Practical Exam">Practical Exam</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Semester</label>
                                    <select
                                        name="semester"
                                        value={marksForm.semester}
                                        onChange={handleAddChange}
                                        className="form-control"
                                    >
                                        {[1,2,3,4,5,6,7,8].map((s) => (
                                            <option key={s} value={s}>Semester {s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Internal Marks</label>
                                    <input
                                        type="number"
                                        name="internalMarks"
                                        value={marksForm.internalMarks}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        min={0}
                                        max={100}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>External Marks</label>
                                    <input
                                        type="number"
                                        name="externalMarks"
                                        value={marksForm.externalMarks}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        min={0}
                                        max={100}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Academic Year</label>
                                    <input
                                        type="text"
                                        name="academicYear"
                                        value={marksForm.academicYear}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        placeholder="2025-2026"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Examination Date</label>
                                    <input
                                        type="date"
                                        name="examDate"
                                        value={marksForm.examDate}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group form-grid-full">
                                    <label>Instructor Remarks (Optional)</label>
                                    <input
                                        type="text"
                                        name="remarks"
                                        value={marksForm.remarks}
                                        onChange={handleAddChange}
                                        className="form-control"
                                        placeholder="e.g. Excellent presentation, Needs study help"
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={18} /> Record Grades
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* All Grades Table */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>All Logged Grade Records</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Roll Number</th>
                                        <th>Subject</th>
                                        <th>Exam Type</th>
                                        <th>Semester</th>
                                        <th>Internal</th>
                                        <th>External</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                                Loading marks database...
                                            </td>
                                        </tr>
                                    ) : marksList.length > 0 ? (
                                        marksList.map((m) => (
                                            <tr key={m.id}>
                                                <td style={{ fontWeight: "600" }}>{m.student?.user?.name}</td>
                                                <td style={{ fontWeight: "700" }}>{m.student?.rollNumber}</td>
                                                <td style={{ fontWeight: "600" }}>{m.subject}</td>
                                                <td>{m.examType}</td>
                                                <td>Sem {m.semester}</td>
                                                <td>{m.internalMarks}</td>
                                                <td>{m.externalMarks}</td>
                                                <td style={{ fontWeight: "700", color: "#4f46e5" }}>{m.totalMarks}</td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button 
                                                            className="btn btn-secondary btn-icon"
                                                            onClick={() => openEditModal(m)}
                                                            title="Edit record"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button 
                                                            className="btn btn-danger btn-icon"
                                                            onClick={() => handleDelete(m.id, m.subject, m.student?.user?.name)}
                                                            title="Delete record"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                No marks logged in database.
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
                    {/* Summary row */}
                    <div className="stat-cards-grid">
                        <div className="stat-card" style={{ borderLeft: "4px solid #4f46e5" }}>
                            <div className="stat-card-icon-wrapper" style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}>
                                <Award size={24} />
                            </div>
                            <div className="stat-card-info">
                                <span className="stat-card-label">Average Performance Score</span>
                                <span className="stat-card-value">
                                    {marksList.length > 0 ? `${calculateAvgScore().toFixed(1)}` : "0.0"}
                                </span>
                            </div>
                        </div>

                        <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
                            <div className="stat-card-icon-wrapper" style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
                                <Award size={24} />
                            </div>
                            <div className="stat-card-info">
                                <span className="stat-card-label">Total Examinations Taken</span>
                                <span className="stat-card-value">{marksList.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="dashboard-section">
                        <div className="dashboard-section-header">
                            <h2>My Academic Grade Sheet</h2>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Subject Course</th>
                                        <th>Exam Type</th>
                                        <th>Academic Year</th>
                                        <th>Semester</th>
                                        <th>Internal Marks</th>
                                        <th>External Marks</th>
                                        <th>Total Score</th>
                                        <th>Instructor Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#2563eb", fontWeight: "600" }}>
                                                Loading academic sheet...
                                            </td>
                                        </tr>
                                    ) : marksList.length > 0 ? (
                                        marksList.map((m) => (
                                            <tr key={m.id}>
                                                <td style={{ fontWeight: "700", color: "#0f172a" }}>{m.subject}</td>
                                                <td>{m.examType}</td>
                                                <td>{m.academicYear}</td>
                                                <td>Semester {m.semester}</td>
                                                <td>{m.internalMarks}</td>
                                                <td>{m.externalMarks}</td>
                                                <td style={{ fontWeight: "700", color: "#2563eb" }}>{m.totalMarks}</td>
                                                <td style={{ fontStyle: m.remarks ? "normal" : "italic", color: m.remarks ? "#475569" : "#94a3b8" }}>
                                                    {m.remarks || "No remarks"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                                                No examination grades recorded for your account.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Marks Modal */}
            {isEditOpen && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <h3>Modify Grades Record</h3>
                            <button className="close-modal-btn" onClick={() => setIsEditOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group form-grid-full">
                                        <span style={{ fontSize: "14px", color: "#475569" }}>
                                            Subject: <strong>{selectedMark?.subject}</strong> | Student: <strong>{selectedMark?.student?.user?.name}</strong>
                                        </span>
                                    </div>

                                    <div className="form-group">
                                        <label>Internal Marks</label>
                                        <input
                                            type="number"
                                            name="internalMarks"
                                            value={editForm.internalMarks}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            min={0}
                                            max={100}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>External Marks</label>
                                        <input
                                            type="number"
                                            name="externalMarks"
                                            value={editForm.externalMarks}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            min={0}
                                            max={100}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Examination Type</label>
                                        <select
                                            name="examType"
                                            value={editForm.examType}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        >
                                            <option value="Internal Assessment 1">Internal Assessment 1</option>
                                            <option value="Internal Assessment 2">Internal Assessment 2</option>
                                            <option value="Semester Exam">Semester Exam</option>
                                            <option value="Practical Exam">Practical Exam</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Semester</label>
                                        <select
                                            name="semester"
                                            value={editForm.semester}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        >
                                            {[1,2,3,4,5,6,7,8].map((s) => (
                                                <option key={s} value={s}>Semester {s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group form-grid-full">
                                        <label>Academic Year</label>
                                        <input
                                            type="text"
                                            name="academicYear"
                                            value={editForm.academicYear}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group form-grid-full">
                                        <label>Instructor Remarks</label>
                                        <input
                                            type="text"
                                            name="remarks"
                                            value={editForm.remarks}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Marks;
