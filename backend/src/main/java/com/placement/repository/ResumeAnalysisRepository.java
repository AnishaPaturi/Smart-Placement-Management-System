package com.placement.repository;

import com.placement.model.ResumeAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ResumeAnalysisRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(ResumeAnalysis analysis) {
        String sql = "INSERT INTO resume_analyses (student_id, skills, certifications, cgpa, education, experience, projects, summary, raw_analysis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, analysis.getStudentId(), analysis.getSkills(), analysis.getCertifications(),
                analysis.getCgpa(), analysis.getEducation(), analysis.getExperience(), analysis.getProjects(),
                analysis.getSummary(), analysis.getRawAnalysis());
    }

    public List<ResumeAnalysis> findByStudentId(Integer studentId) {
        String sql = "SELECT * FROM resume_analyses WHERE student_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ResumeAnalysis.class), studentId);
    }
}

