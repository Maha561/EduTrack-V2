package com.edutrack.edutrack_backend.controller;


import com.edutrack.edutrack_backend.dto.AttendanceRequest;
import com.edutrack.edutrack_backend.dto.MarksRequest;

import com.edutrack.edutrack_backend.entity.Attendance;
import com.edutrack.edutrack_backend.entity.Marks;
import com.edutrack.edutrack_backend.entity.Student;

import com.edutrack.edutrack_backend.service.AdminService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/admin")
public class AdminController {



    private final AdminService adminService;



    public AdminController(AdminService adminService){

        this.adminService = adminService;

    }



    // Manage Students

    @GetMapping("/students")
    public List<Student> getStudents(){

        return adminService.getAllStudents();

    }




    // Mark Entry Management

    @PostMapping("/marks")
    public String addMarks(
            @RequestBody MarksRequest request){

        return adminService.addMarks(request);

    }



    @GetMapping("/marks")
    public List<Marks> getMarks(){

        return adminService.getAllMarks();

    }




    // Attendance Management

    @PostMapping("/attendance")
    public String addAttendance(
            @RequestBody AttendanceRequest request){

        return adminService.addAttendance(request);

    }



    @GetMapping("/attendance")
    public List<Attendance> getAttendance(){

        return adminService.getAllAttendance();

    }



}