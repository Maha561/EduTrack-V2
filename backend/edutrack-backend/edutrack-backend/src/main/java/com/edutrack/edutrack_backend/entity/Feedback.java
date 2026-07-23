package com.edutrack.edutrack_backend.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter




@Entity
@Table(name = "feedback")
public class Feedback {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    
    @Column(nullable = false, length = 100)
    private String category;

 

   @Column(nullable = false, length = 150)
   private String title;


   @Column(nullable = false, length = 1000)
   private String message;


   @Column(name = "given_by", nullable = false, length = 100)
   private String givenBy;


   @Column(name = "feedback_date", nullable = false)
   private LocalDate feedbackDate;








}
