package com.edutrack.edutrack_backend.service;


import com.edutrack.edutrack_backend.dto.AttendanceRequest;
import com.edutrack.edutrack_backend.dto.MarksRequest;

import com.edutrack.edutrack_backend.entity.Attendance;
import com.edutrack.edutrack_backend.entity.Marks;
import com.edutrack.edutrack_backend.entity.Student;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminService {


    private final StudentService studentService;
    private final MarksService marksService;
    private final AttendanceService attendanceService;



    public AdminService(
            StudentService studentService,
            MarksService marksService,
            AttendanceService attendanceService
    ) {

        this.studentService = studentService;
        this.marksService = marksService;
        this.attendanceService = attendanceService;

    }



    // Student Management

    public List<Student> getAllStudents(){

        return studentService.getAllStudents();

    }



    // Marks Management

    public String addMarks(MarksRequest request){

        return marksService.addMarks(request);

    }


    public List<Marks> getAllMarks(){

        return marksService.getAllMarks();

    }




    // Attendance Management

    public String addAttendance(AttendanceRequest request){

        return attendanceService.addAttendance(request);

    }



    public List<Attendance> getAllAttendance(){

        return attendanceService.getAllAttendance();

    }



}