package com.edutrack.edutrack_backend.controller;


import com.edutrack.edutrack_backend.dto.StudentRequest;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.service.StudentService;
import org.springframework.web.bind.annotation.*;


import com.edutrack.edutrack_backend.dto.StudentRequest;

import java.util.List;
import com.edutrack.edutrack_backend.entity.Student;



@RestController
@RequestMapping("/students")

public class StudentController {




    private final StudentService studentService;


      public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }


@PostMapping
public String createStudent(@RequestBody StudentRequest request) {

    return studentService.createStudent(request);

}

@GetMapping
public List<Student> getAllStudents() {

    return studentService.getAllStudents();

}

@GetMapping("/{id}")
public Student getStudentById(@PathVariable Long id) {

    return studentService.getStudentById(id);

}


@PutMapping("/{id}")
public String updateStudent(
        @PathVariable Long id,
        @RequestBody StudentRequest request) {

    return studentService.updateStudent(id, request);

}

@DeleteMapping("/{id}")
public String deleteStudent(@PathVariable Long id) {

    return studentService.deleteStudent(id);

}





    

}
