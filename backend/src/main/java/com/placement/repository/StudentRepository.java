package com.placement.repository;

import com.placement.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StudentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Student student) {
        String sql = "INSERT INTO students (name, email, password, cgpa, branch, active_backlogs, skills, certifications, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getPassword(), 
                                   student.getCgpa(), student.getBranch(), student.getActiveBacklogs(), 
                                   student.getSkills(), student.getCertifications(), student.getResumeUrl());
    }

    public Student findByEmail(String email) {
        String sql = "SELECT * FROM students WHERE email = ?";
        List<Student> students = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Student.class), email);
        return students.isEmpty() ? null : students.get(0);
    }
    
    public List<Student> findAll() {
        String sql = "SELECT * FROM students";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Student.class));
    }
}
