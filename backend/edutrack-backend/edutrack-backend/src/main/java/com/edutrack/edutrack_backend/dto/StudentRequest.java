package com.edutrack.edutrack_backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {

    // User details (for login account creation)
    private String name;

    private String email;

    private String password;


    // Student details
    private String rollNumber;

    private String department;

    private Integer year;

    private Integer semester;

    private String section;

    private String phone;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private String parentName;

}