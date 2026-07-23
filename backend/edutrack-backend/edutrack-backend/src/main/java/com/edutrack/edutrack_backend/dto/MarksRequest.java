package com.edutrack.edutrack_backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class MarksRequest {


    private Long studentId;

    private String subject;

    private String examType;

    private Integer internalMarks;

    private Integer externalMarks;

    private Integer totalMarks;

    private String academicYear;

    private Integer semester;

    private LocalDate examDate;

    private String remarks;

}
