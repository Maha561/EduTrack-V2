import React, { useState, useEffect } from "react";
import studentService from "../services/studentService";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import "../App.css";

function Students() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form states
    const [addForm, setAddForm] = useState({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        department: "CSE",
        year: 1,
        semester: 1,
        section: "A",
        phone: "",
        dateOfBirth: "",
        gender: "MALE",
        address: "",
        parentName: ""
    });

    const [editForm, setEditForm] = useState({
        department: "CSE",
        year: 1,
        semester: 1,
        section: "A",
        phone: "",
        address: "",
        parentName: ""
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const data = await studentService.getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Error loading students list", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddForm({
            ...addForm,
            [name]: name === "year" || name === "semester" ? parseInt(value) : value
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: name === "year" || name === "semester" ? parseInt(value) : value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await studentService.createStudent(addForm);
            alert(res || "Student created successfully!");
            setIsAddOpen(false);
            // Reset form
            setAddForm({
                name: "",
                email: "",
                password: "",
                rollNumber: "",
                department: "CSE",
                year: 1,
                semester: 1,
                section: "A",
                phone: "",
                dateOfBirth: "",
                gender: "MALE",
                address: "",
                parentName: ""
            });
            fetchStudents();
        } catch (error) {
            alert(error.response?.data || "Failed to create student. Make sure Roll Number and Email are unique.");
        }
    };

    const openEditModal = (student) => {
        setSelectedStudent(student);
        setEditForm({
            department: student.department,
            year: student.year,
            semester: student.semester,
            section: student.section,
            phone: student.phone,
            address: student.address,
            parentName: student.parentName
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await studentService.updateStudent(selectedStudent.id, editForm);
            alert(res || "Student updated successfully!");
            setIsEditOpen(false);
            fetchStudents();
        } catch (error) {
            alert("Failed to update student details.");
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This will also delete their login account.`)) {
            try {
                const res = await studentService.deleteStudent(id);
                alert(res || "Student deleted successfully!");
                fetchStudents();
            } catch (error) {
                alert("Failed to delete student.");
            }
        }
    };

    // Filter students
    const filteredStudents = students.filter((s) => {
        const matchesSearch = 
            s.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDept = deptFilter === "ALL" || s.department === deptFilter;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="students-page">
            {/* Header controls */}
            <div 
                style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "24px", 
                    flexWrap: "wrap",
                    gap: "16px" 
                }}
            >
                <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "280px" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <Search size={18} style={{ position: "absolute", left: "14px", top: "12px", color: "#64748b" }} />
                        <input
                            type="text"
                            placeholder="Search by name, roll no, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control"
                            style={{ paddingLeft: "42px", width: "100%" }}
                        />
                    </div>

                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="form-control"
                        style={{ width: "160px" }}
                    >
                        <option value="ALL">All Departments</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                        <option value="IT">IT</option>
                    </select>
                </div>

                <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
                    <Plus size={18} /> Register Student
                </button>
            </div>

            {/* Table */}
            <div className="dashboard-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Sem / Year</th>
                                <th>Sec</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#2563eb", fontWeight: "600" }}>
                                        Loading student directory...
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((s) => (
                                    <tr key={s.id}>
                                        <td style={{ fontWeight: "700" }}>{s.rollNumber}</td>
                                        <td style={{ fontWeight: "600" }}>{s.user?.name}</td>
                                        <td>{s.user?.email}</td>
                                        <td>{s.department}</td>
                                        <td>Sem {s.semester} / Yr {s.year}</td>
                                        <td style={{ fontWeight: "600" }}>{s.section}</td>
                                        <td>{s.phone}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button 
                                                    className="btn btn-secondary btn-icon"
                                                    onClick={() => openEditModal(s)}
                                                    title="Edit student"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-icon"
                                                    onClick={() => handleDelete(s.id, s.user?.name)}
                                                    title="Delete student"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                        No students found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
            {isAddOpen && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <h3>Register New Student</h3>
                            <button className="close-modal-btn" onClick={() => setIsAddOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group form-grid-full">
                                        <h4 style={{ margin: "0 0 4px 0", color: "#2563eb", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Login Account Details</h4>
                                    </div>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={addForm.name}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={addForm.email}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="john@gmail.com"
                                        />
                                    </div>
                                    <div className="form-group form-grid-full">
                                        <label>Account Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={addForm.password}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="Create password"
                                        />
                                    </div>

                                    <div className="form-group form-grid-full" style={{ marginTop: "12px" }}>
                                        <h4 style={{ margin: "0 0 4px 0", color: "#2563eb", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Student Academic Info</h4>
                                    </div>
                                    <div className="form-group">
                                        <label>Roll Number</label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            value={addForm.rollNumber}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="CSE105"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select
                                            name="department"
                                            value={addForm.department}
                                            onChange={handleAddChange}
                                            className="form-control"
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">MECH</option>
                                            <option value="IT">IT</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Year of Study</label>
                                        <select
                                            name="year"
                                            value={addForm.year}
                                            onChange={handleAddChange}
                                            className="form-control"
                                        >
                                            <option value={1}>1st Year</option>
                                            <option value={2}>2nd Year</option>
                                            <option value={3}>3rd Year</option>
                                            <option value={4}>4th Year</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Current Semester</label>
                                        <select
                                            name="semester"
                                            value={addForm.semester}
                                            onChange={handleAddChange}
                                            className="form-control"
                                        >
                                            {[1,2,3,4,5,6,7,8].map((s) => (
                                                <option key={s} value={s}>Semester {s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Section</label>
                                        <input
                                            type="text"
                                            name="section"
                                            value={addForm.section}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="A"
                                            maxLength={10}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={addForm.phone}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={addForm.dateOfBirth}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select
                                            name="gender"
                                            value={addForm.gender}
                                            onChange={handleAddChange}
                                            className="form-control"
                                        >
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Parent/Guardian Name</label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={addForm.parentName}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            required
                                            placeholder="Guardian Name"
                                        />
                                    </div>
                                    <div className="form-group form-grid-full">
                                        <label>Home Address</label>
                                        <textarea
                                            name="address"
                                            value={addForm.address}
                                            onChange={handleAddChange}
                                            className="form-control"
                                            rows="2"
                                            required
                                            placeholder="Enter address details"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {isEditOpen && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-header">
                            <h3>Edit Student Academic Profile</h3>
                            <button className="close-modal-btn" onClick={() => setIsEditOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group form-grid-full">
                                        <span style={{ fontSize: "14px", color: "#475569" }}>
                                            Editing details for <strong>{selectedStudent?.user?.name}</strong> ({selectedStudent?.rollNumber})
                                        </span>
                                    </div>

                                    <div className="form-group">
                                        <label>Department</label>
                                        <select
                                            name="department"
                                            value={editForm.department}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        >
                                            <option value="CSE">CSE</option>
                                            <option value="ECE">ECE</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">MECH</option>
                                            <option value="IT">IT</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Section</label>
                                        <input
                                            type="text"
                                            name="section"
                                            value={editForm.section}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            required
                                            placeholder="A"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Year of Study</label>
                                        <select
                                            name="year"
                                            value={editForm.year}
                                            onChange={handleEditChange}
                                            className="form-control"
                                        >
                                            <option value={1}>1st Year</option>
                                            <option value={2}>2nd Year</option>
                                            <option value={3}>3rd Year</option>
                                            <option value={4}>4th Year</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Current Semester</label>
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

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Parent/Guardian Name</label>
                                        <input
                                            type="text"
                                            name="parentName"
                                            value={editForm.parentName}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group form-grid-full">
                                        <label>Home Address</label>
                                        <textarea
                                            name="address"
                                            value={editForm.address}
                                            onChange={handleEditChange}
                                            className="form-control"
                                            rows="2"
                                            required
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

export default Students;
