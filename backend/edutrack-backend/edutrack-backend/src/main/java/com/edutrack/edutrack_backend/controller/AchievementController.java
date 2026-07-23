package com.edutrack.edutrack_backend.controller;

import com.edutrack.edutrack_backend.dto.AchievementRequest;
import com.edutrack.edutrack_backend.entity.Achievements;
import com.edutrack.edutrack_backend.service.AchievementService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
public class AchievementController {


    private final AchievementService achievementService;


    public AchievementController(AchievementService achievementService) {

        this.achievementService = achievementService;

    }


    @PostMapping
    public String addAchievement(@RequestBody AchievementRequest request) {

        return achievementService.addAchievement(request);

    }


    @GetMapping
    public List<Achievements> getAllAchievements() {

        return achievementService.getAllAchievements();

    }

}