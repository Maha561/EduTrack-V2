package com.edutrack.edutrack_backend.controller;

import com.edutrack.edutrack_backend.dto.MarksRequest;
import com.edutrack.edutrack_backend.entity.Marks;
import com.edutrack.edutrack_backend.service.MarksService;
import org.springframework.web.bind.annotation.*;

import java.util.List;






@RestController
@RequestMapping("/marks")
public class MarksController {

    private final MarksService marksService;


    public MarksController(MarksService marksService) {

        this.marksService = marksService;

    }

    @PostMapping
public String addMarks(@RequestBody MarksRequest request) {

    return marksService.addMarks(request);

}

@GetMapping
public List<Marks> getAllMarks() {

    return marksService.getAllMarks();

}

@GetMapping("/{id}")
public Marks getMarksById(@PathVariable Long id) {

    return marksService.getMarksById(id);

}

@PutMapping("/{id}")
public String updateMarks(
        @PathVariable Long id,
        @RequestBody MarksRequest request) {

    return marksService.updateMarks(id, request);

}

@DeleteMapping("/{id}")
public String deleteMarks(@PathVariable Long id) {

    return marksService.deleteMarks(id);

}

}
