package com.edutrack.edutrack_backend.repository;

import com.edutrack.edutrack_backend.entity.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarksRepository extends JpaRepository<Marks, Long> {

}