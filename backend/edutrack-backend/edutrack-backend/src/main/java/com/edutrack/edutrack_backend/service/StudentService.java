package com.edutrack.edutrack_backend.service;

import com.edutrack.edutrack_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import com.edutrack.edutrack_backend.dto.StudentRequest;
import com.edutrack.edutrack_backend.entity.Student;
import com.edutrack.edutrack_backend.entity.User;
import com.edutrack.edutrack_backend.repository.UserRepository;

import com.edutrack.edutrack_backend.entity.Gender;

import java.util.List;
import java.util.Optional;




@Service
public class StudentService {

       private final StudentRepository studentRepository;
        private final UserRepository userRepository;



    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
         this.userRepository = userRepository;
    }

    public String createStudent(StudentRequest request) {


    User user = new User();

user.setName(request.getName());
user.setEmail(request.getEmail());
user.setPassword(request.getPassword());
user.setRole("STUDENT");

userRepository.save(user);
Student student = new Student();

student.setUser(user);
student.setRollNumber(request.getRollNumber());
student.setDepartment(request.getDepartment());
student.setYear(request.getYear());
student.setSemester(request.getSemester());
student.setSection(request.getSection());
student.setPhone(request.getPhone());
student.setDateOfBirth(request.getDateOfBirth());
student.setAddress(request.getAddress());
student.setParentName(request.getParentName());
student.setGender(Gender.valueOf(request.getGender()));

studentRepository.save(student);


return "Student created successfully";
}


public List<Student> getAllStudents() {

    return studentRepository.findAll();

}

// update

public Student getStudentById(Long id) {

    return studentRepository.findById(id)
            .orElse(null);

}

public String updateStudent(Long id, StudentRequest request) {

    Student student = studentRepository.findById(id)
            .orElse(null);


    if(student == null) {
        return "Student not found";
    }


    student.setDepartment(request.getDepartment());
    student.setYear(request.getYear());
    student.setSemester(request.getSemester());
    student.setSection(request.getSection());
    student.setPhone(request.getPhone());
    student.setAddress(request.getAddress());
    student.setParentName(request.getParentName());


    studentRepository.save(student);


    return "Student updated successfully";
}


// delete 

public String deleteStudent(Long id) {

    Student student = studentRepository.findById(id)
            .orElse(null);


    if(student == null) {
        return "Student not found";
    }


    studentRepository.delete(student);


    return "Student deleted successfully";
}







}


