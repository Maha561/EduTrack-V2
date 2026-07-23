package com.edutrack.edutrack_backend.controller;


import com.edutrack.edutrack_backend.dto.DashboardResponse;
import com.edutrack.edutrack_backend.service.DashboardService;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/dashboard")
public class DashboardController {


    private final DashboardService dashboardService;


    public DashboardController(DashboardService dashboardService) {

        this.dashboardService = dashboardService;

    }



    @GetMapping("/admin")
    public DashboardResponse getAdminDashboard() {

        return dashboardService.getAdminDashboard();

    }



    @GetMapping("/student/{studentId}")
    public DashboardResponse getStudentDashboard(
            @PathVariable Long studentId) {


        return dashboardService.getStudentDashboard(studentId);

    }

}