package com.edutrack.edutrack_backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SmartInsightResponse {

    private Long studentId;

    private String riskLevel;

    private String insightTitle;

    private String insightMessage;

    private String recommendedActions;

    private LocalDate generatedDate;

}