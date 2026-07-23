package com.edutrack.edutrack_backend.controller;

import com.edutrack.edutrack_backend.dto.FeedbackRequest;
import com.edutrack.edutrack_backend.entity.Feedback;
import com.edutrack.edutrack_backend.service.FeedbackService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {


    private final FeedbackService feedbackService;


    public FeedbackController(FeedbackService feedbackService) {

        this.feedbackService = feedbackService;

    }


    @PostMapping
    public String addFeedback(@RequestBody FeedbackRequest request) {

        return feedbackService.addFeedback(request);

    }


    @GetMapping
    public List<Feedback> getAllFeedback() {

        return feedbackService.getAllFeedback();

    }

}