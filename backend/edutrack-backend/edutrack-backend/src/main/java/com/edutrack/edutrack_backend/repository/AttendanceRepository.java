package com.edutrack.edutrack_backend.repository;

import com.edutrack.edutrack_backend.entity.Attendance;
import com.edutrack.edutrack_backend.entity.AttendanceStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    long countByStudentId(Long studentId);

long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

}