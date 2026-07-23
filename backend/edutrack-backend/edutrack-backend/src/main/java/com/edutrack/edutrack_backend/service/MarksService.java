package com.edutrack.edutrack_backend.service;


import com.edutrack.edutrack_backend.repository.MarksRepository;
import org.springframework.stereotype.Service;

import com.edutrack.edutrack_backend.dto.MarksRequest;
import com.edutrack.edutrack_backend.entity.Marks;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.repository.StudentRepository;

import java.util.List;

import java.util.Optional;



@Service
public class MarksService {

        private final MarksRepository marksRepository;
        private final StudentRepository studentRepository;


    public MarksService(MarksRepository marksRepository,StudentRepository studentRepository) {

        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;

    }

    public String addMarks(MarksRequest request) {


    Student student = studentRepository.findById(request.getStudentId())
            .orElse(null);


    if(student == null) {
        return "Student not found";
    }


    Marks marks = new Marks();

    marks.setStudent(student);
    marks.setSubject(request.getSubject());
    marks.setExamType(request.getExamType());
    marks.setInternalMarks(request.getInternalMarks());
    marks.setExternalMarks(request.getExternalMarks());
    marks.setTotalMarks(request.getTotalMarks());
    marks.setAcademicYear(request.getAcademicYear());
    marks.setSemester(request.getSemester());
    marks.setExamDate(request.getExamDate());
    marks.setRemarks(request.getRemarks());


    marksRepository.save(marks);


    return "Marks added successfully";
}

public List<Marks> getAllMarks() {

    return marksRepository.findAll();

}

public Marks getMarksById(Long id) {

    return marksRepository.findById(id)
            .orElse(null);

}

public String updateMarks(Long id, MarksRequest request) {


    Marks marks = marksRepository.findById(id)
            .orElse(null);


    if(marks == null) {
        return "Marks not found";
    }


    marks.setSubject(request.getSubject());
    marks.setExamType(request.getExamType());
    marks.setInternalMarks(request.getInternalMarks());
    marks.setExternalMarks(request.getExternalMarks());
    marks.setTotalMarks(request.getTotalMarks());
    marks.setAcademicYear(request.getAcademicYear());
    marks.setSemester(request.getSemester());
    marks.setExamDate(request.getExamDate());
    marks.setRemarks(request.getRemarks());


    marksRepository.save(marks);


    return "Marks updated successfully";
}

public String deleteMarks(Long id) {


    Marks marks = marksRepository.findById(id)
            .orElse(null);


    if(marks == null) {
        return "Marks not found";
    }


    marksRepository.delete(marks);


    return "Marks deleted successfully";
}


}
