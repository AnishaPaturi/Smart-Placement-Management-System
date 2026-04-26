package com.placement.repository;

import com.placement.model.Interview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class InterviewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Interview interview) {
        String sql = "INSERT INTO interviews (drive_id, student_id, round, interview_date_time, location, notes) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                interview.getDriveId(), interview.getStudentId(), interview.getRound(),
                interview.getInterviewDateTime(), interview.getLocation(), interview.getNotes());
    }

    public List<Interview> findAll() {
        String sql = "SELECT i.*, d.role as drive_name, s.name as student_name FROM interviews i " +
                     "JOIN drives d ON i.drive_id = d.id " +
                     "JOIN students s ON i.student_id = s.id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Interview.class));
    }

    public List<Interview> findByDriveId(int driveId) {
        String sql = "SELECT i.*, d.role as drive_name, s.name as student_name FROM interviews i " +
                     "JOIN drives d ON i.drive_id = d.id " +
                     "JOIN students s ON i.student_id = s.id " +
                     "WHERE i.drive_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Interview.class), driveId);
    }

    public int update(Interview interview) {
        String sql = "UPDATE interviews SET drive_id = ?, student_id = ?, round = ?, interview_date_time = ?, location = ?, notes = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                interview.getDriveId(), interview.getStudentId(), interview.getRound(),
                interview.getInterviewDateTime(), interview.getLocation(), interview.getNotes(), interview.getId());
    }

    public int delete(int id) {
        String sql = "DELETE FROM interviews WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

