package com.edutrack.edutrack_backend.controller;


import com.edutrack.edutrack_backend.entity.SmartInsights;
import com.edutrack.edutrack_backend.service.SmartInsightService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/insights")
public class SmartInsightController {


    private final SmartInsightService smartInsightService;


    public SmartInsightController(SmartInsightService smartInsightService) {

        this.smartInsightService = smartInsightService;

    }



    @PostMapping("/generate/{studentId}")
    public String generateInsight(
            @PathVariable Long studentId) {

        return smartInsightService.generateInsight(studentId);

    }



    @GetMapping("/{studentId}")
    public List<SmartInsights> getInsights(
            @PathVariable Long studentId) {

        return smartInsightService.getInsightsByStudent(studentId);

    }


}