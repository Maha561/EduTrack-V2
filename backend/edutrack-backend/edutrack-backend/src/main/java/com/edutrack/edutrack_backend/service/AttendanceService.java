package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.dto.AttendanceRequest;
import com.edutrack.edutrack_backend.entity.Attendance;
import com.edutrack.edutrack_backend.entity.AttendanceStatus;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.repository.AttendanceRepository;
import com.edutrack.edutrack_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public String addAttendance(AttendanceRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElse(null);

        if (student == null) {
            return "Student not found";
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setDate(request.getDate());
        attendance.setSubject(request.getSubject());
        attendance.setStatus(AttendanceStatus.valueOf(request.getStatus()));
        attendance.setRemarks(request.getRemarks());

        attendanceRepository.save(attendance);

        return "Attendance added successfully";
    }

    public List<Attendance> getAllAttendance() {

    return attendanceRepository.findAll();

}

public double getAttendancePercentage(Long studentId) {

    long total = attendanceRepository.countByStudentId(studentId);

    if (total == 0) {
        return 0;
    }

    long present = attendanceRepository.countByStudentIdAndStatus(
            studentId,
            AttendanceStatus.PRESENT
    );

    return ((double) present / total) * 100;
}
}