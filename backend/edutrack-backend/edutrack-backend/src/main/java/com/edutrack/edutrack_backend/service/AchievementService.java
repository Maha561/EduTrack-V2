package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.dto.AchievementRequest;
import com.edutrack.edutrack_backend.entity.Achievements;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.repository.AchievementRepository;
import com.edutrack.edutrack_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final StudentRepository studentRepository;


    public AchievementService(AchievementRepository achievementRepository,
                              StudentRepository studentRepository) {

        this.achievementRepository = achievementRepository;
        this.studentRepository = studentRepository;
    }


    public String addAchievement(AchievementRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElse(null);


        if(student == null) {
            return "Student not found";
        }


        Achievements achievement = new Achievements();


        achievement.setStudent(student);
        achievement.setAchievementType(request.getAchievementType());
        achievement.setBatchName(request.getBatchName());
        achievement.setAchievementDate(request.getAchievementDate());
        achievement.setDescription(request.getDescription());


        achievementRepository.save(achievement);


        return "Achievement added successfully";
    }


    public List<Achievements> getAllAchievements() {

        return achievementRepository.findAll();

    }

}