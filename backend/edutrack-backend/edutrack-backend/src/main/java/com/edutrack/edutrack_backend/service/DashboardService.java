package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.dto.DashboardResponse;
import com.edutrack.edutrack_backend.entity.AttendanceStatus;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.repository.AttendanceRepository;
import com.edutrack.edutrack_backend.repository.AchievementRepository;
import com.edutrack.edutrack_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;


@Service
public class DashboardService {


    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final AchievementRepository achievementRepository;



    public DashboardService(
            StudentRepository studentRepository,
            AttendanceRepository attendanceRepository,
            AchievementRepository achievementRepository
    ) {

        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.achievementRepository = achievementRepository;

    }



    // Admin Dashboard

    public DashboardResponse getAdminDashboard() {


        DashboardResponse response = new DashboardResponse();


        response.setTotalStudents(
                studentRepository.count()
        );


        response.setTotalAchievements(
                achievementRepository.count()
        );


        response.setAverageAttendance(0.0);


        return response;

    }



    // Student Dashboard

    public DashboardResponse getStudentDashboard(Long studentId) {


        DashboardResponse response = new DashboardResponse();


        Student student = studentRepository.findById(studentId)
                .orElse(null);



        if(student == null) {

            return null;

        }



        long totalAttendance =
                attendanceRepository.countByStudentId(studentId);



        long presentAttendance =
                attendanceRepository.countByStudentIdAndStatus(
                        studentId,
                        AttendanceStatus.PRESENT
                );



        double percentage = 0;


        if(totalAttendance > 0) {

            percentage =
                    ((double) presentAttendance / totalAttendance) * 100;

        }



        response.setStudentName(
        student.getUser().getName()
);


        response.setAttendancePercentage(
                percentage
        );


        response.setAchievementCount(
                (int) achievementRepository.countByStudentId(studentId)
        );


        return response;

    }


}