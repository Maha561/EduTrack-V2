package com.edutrack.edutrack_backend.repository;

import com.edutrack.edutrack_backend.entity.Achievements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchievementRepository extends JpaRepository<Achievements, Long> {

      long countByStudentId(Long studentId);

}