package com.placement.repository;

import com.placement.model.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ApplicationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Application app) {
        String sql = "INSERT INTO applications (student_id, drive_id, status) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, app.getStudentId(), app.getDriveId(), app.getStatus().name());
    }

    public int updateStatus(int id, String status) {
        String sql = "UPDATE applications SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, id);
    }

    public List<Application> findByStudentId(int studentId) {
        String sql = "SELECT a.*, d.role, c.name as company_name FROM applications a " +
                     "JOIN drives d ON a.drive_id = d.id " +
                     "JOIN companies c ON d.company_id = c.id " +
                     "WHERE a.student_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Application.class), studentId);
    }
    
    public List<Application> findByDriveId(int driveId) {
        String sql = "SELECT a.*, s.name as student_name FROM applications a " +
                     "JOIN students s ON a.student_id = s.id " +
                     "WHERE a.drive_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Application.class), driveId);
    }
    
    public List<Application> findAll() {
        String sql = "SELECT a.*, s.name as student_name, d.role, c.name as company_name FROM applications a " +
                     "JOIN students s ON a.student_id = s.id " +
                     "JOIN drives d ON a.drive_id = d.id " +
                     "JOIN companies c ON d.company_id = c.id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Application.class));
    }
}
