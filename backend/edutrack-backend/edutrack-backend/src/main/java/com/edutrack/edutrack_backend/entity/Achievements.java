package com.edutrack.edutrack_backend.entity;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter



@Entity
@Table(name = "achievements")
public class Achievements {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;


    @Column(nullable = false, length = 100)
    private String achievementType;


    @Column(name = "batch_name", nullable = false, length = 100)
    private String batchName;


    @Column(name = "achievement_date", nullable = false)
    private LocalDate achievementDate;

    @Column(length = 1000)
    private String description;



}
