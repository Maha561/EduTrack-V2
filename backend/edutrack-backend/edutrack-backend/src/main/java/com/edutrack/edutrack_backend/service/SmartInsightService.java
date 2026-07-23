package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.entity.AttendanceStatus;
import com.edutrack.edutrack_backend.entity.SmartInsights;
import com.edutrack.edutrack_backend.entity.Student;

import com.edutrack.edutrack_backend.repository.AttendanceRepository;
import com.edutrack.edutrack_backend.repository.MarksRepository;
import com.edutrack.edutrack_backend.repository.SmartInsightRepository;
import com.edutrack.edutrack_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class SmartInsightService {


    private final SmartInsightRepository smartInsightRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarksRepository marksRepository;



    public SmartInsightService(
            SmartInsightRepository smartInsightRepository,
            StudentRepository studentRepository,
            AttendanceRepository attendanceRepository,
            MarksRepository marksRepository
    ) {

        this.smartInsightRepository = smartInsightRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.marksRepository = marksRepository;

    }



    public String generateInsight(Long studentId) {


        Student student = studentRepository.findById(studentId)
                .orElse(null);


        if(student == null) {

            return "Student not found";

        }



        long totalAttendance =
                attendanceRepository.countByStudentId(studentId);



        long presentAttendance =
                attendanceRepository.countByStudentIdAndStatus(
                        studentId,
                        AttendanceStatus.PRESENT
                );



        double attendancePercentage = 0;


        if(totalAttendance > 0) {

            attendancePercentage =
                    ((double) presentAttendance / totalAttendance) * 100;

        }



        SmartInsights insight = new SmartInsights();


        insight.setStudent(student);

        insight.setGeneratedDate(LocalDate.now());



        if(attendancePercentage < 75) {


            insight.setRiskLevel("HIGH");

            insight.setInsightTitle("Attendance Warning");

            insight.setInsightMessage(
                    "Student attendance is below 75%"
            );

            insight.setRecommendedActions(
                    "Improve attendance regularly"
            );


        }

        else {


            insight.setRiskLevel("LOW");

            insight.setInsightTitle("Good Performance");

            insight.setInsightMessage(
                    "Student attendance is satisfactory"
            );

            insight.setRecommendedActions(
                    "Maintain current performance"
            );

        }



        smartInsightRepository.save(insight);



        return "Insight generated successfully";

    }





    public List<SmartInsights> getInsightsByStudent(Long studentId) {


        return smartInsightRepository.findByStudentId(studentId);

    }


}