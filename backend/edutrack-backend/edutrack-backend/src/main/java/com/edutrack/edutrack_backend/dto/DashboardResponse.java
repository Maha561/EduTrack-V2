package com.edutrack.edutrack_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardResponse {


    // Admin Dashboard fields

    private Long totalStudents;

    private Double averageAttendance;

    private Long totalAchievements;



    // Student Dashboard fields

    private String studentName;

    private Double attendancePercentage;

    private Integer achievementCount;


}
