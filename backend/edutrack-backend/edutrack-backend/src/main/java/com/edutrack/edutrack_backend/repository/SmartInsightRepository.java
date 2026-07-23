package com.edutrack.edutrack_backend.repository;

import com.edutrack.edutrack_backend.entity.SmartInsights;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SmartInsightRepository extends JpaRepository<SmartInsights, Long> {

        List<SmartInsights> findByStudentId(Long studentId);

}