package com.edutrack.edutrack_backend.controller;

import com.edutrack.edutrack_backend.dto.AttendanceRequest;
import com.edutrack.edutrack_backend.entity.Attendance;
import com.edutrack.edutrack_backend.service.AttendanceService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;


    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }


    @PostMapping
    public String addAttendance(@RequestBody AttendanceRequest request) {

        return attendanceService.addAttendance(request);
    }


    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }


    @GetMapping("/percentage/{studentId}")
    public double getAttendancePercentage(
            @PathVariable Long studentId) {

        return attendanceService.getAttendancePercentage(studentId);
    }

}