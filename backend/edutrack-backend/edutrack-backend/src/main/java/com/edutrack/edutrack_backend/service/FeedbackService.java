package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.dto.FeedbackRequest;
import com.edutrack.edutrack_backend.entity.Feedback;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.repository.FeedbackRepository;
import com.edutrack.edutrack_backend.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;


    public FeedbackService(FeedbackRepository feedbackRepository,
                           StudentRepository studentRepository) {

        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
    }


    public String addFeedback(FeedbackRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElse(null);


        if(student == null) {
            return "Student not found";
        }


        Feedback feedback = new Feedback();


        feedback.setStudent(student);
        feedback.setCategory(request.getCategory());
        feedback.setTitle(request.getTitle());
        feedback.setMessage(request.getMessage());
        feedback.setGivenBy(request.getGivenBy());
        feedback.setFeedbackDate(request.getFeedbackDate());


        feedbackRepository.save(feedback);


        return "Feedback added successfully";
    }


    public List<Feedback> getAllFeedback() {

        return feedbackRepository.findAll();

    }

}