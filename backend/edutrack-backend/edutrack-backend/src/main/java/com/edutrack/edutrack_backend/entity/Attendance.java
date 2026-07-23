package com.edutrack.edutrack_backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "attendance")
public class Attendance {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;



@ManyToOne
@JoinColumn(name = "student_id", nullable = false)
private Student student;


@Column(nullable = false)
private LocalDate date;


@Enumerated(EnumType.STRING)
@Column(nullable = false)
private AttendanceStatus status;



@Column(nullable = false, length = 100)
private String subject;

@Column(length = 255)
private String remarks;









}
