package com.edutrack.edutrack_backend.entity;


import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "marks")
public class Marks {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@ManyToOne
@JoinColumn(name = "student_id", nullable = false)
private Student student;


@Column(nullable = false, length = 100)
private String subject;


@Column(name = "exam_type", nullable = false, length = 50)
private String examType;


@Column(name = "internal_marks", nullable = false)
private Integer internalMarks;

@Column(name = "external_marks", nullable = false)
private Integer externalMarks;

@Column(name = "total_marks", nullable = false)
private Integer totalMarks;

@Column(name = "academic_year", nullable = false, length = 20)
private String academicYear;

@Column(nullable = false)
private Integer semester;

@Column(name = "exam_date", nullable = false)
private LocalDate examDate;

@Column(length = 255)
private String remarks;









}
