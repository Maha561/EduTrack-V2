package com.edutrack.edutrack_backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name="students")
public class Student {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@OneToOne
@JoinColumn(name = "user_id", nullable = false, unique = true)
private User user;

@Column(name = "roll_number", nullable = false, unique = true, length = 20)
private String rollNumber;

@Column(nullable = false, length = 50)
private String department;

@Column(nullable = false)
private Integer year;

@Column(nullable = false)
private Integer semester;

@Column(nullable = false, length = 10)
private String section;

@Column(nullable = false, length = 15)
private String phone;

@Column(name = "date_of_birth")
private LocalDate dateOfBirth;



@Enumerated(EnumType.STRING)
@Column(length = 20)
private Gender gender;

@Column(length = 255)
private String address;

@Column(name = "parent_name", length = 100)
private String parentName;








}
