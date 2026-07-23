package com.edutrack.edutrack_backend.entity;

import jakarta.persistence.Table;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter





@Entity
@Table(name = "smart_insights")

public class SmartInsights {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@ManyToOne
@JoinColumn(name = "student_id", nullable = false)
private Student student;

@Column(name = "risk_level", nullable = false, length = 50)
private String riskLevel;

@Column(name = "insight_title", nullable = false, length = 100)
private String insightTitle;

@Column(name = "insight_message", nullable = false, columnDefinition = "TEXT")
private String insightMessage;

@Column(name = "recommended_actions", length = 500)
private String recommendedActions;

@Column(name = "generated_date", nullable = false)
private LocalDate generatedDate;










}
