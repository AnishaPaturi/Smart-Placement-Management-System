package com.placement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getTopHiringCompanies() {
        String sql = "SELECT c.name, COUNT(a.id) as placed_students " +
                     "FROM applications a " +
                     "JOIN drives d ON a.drive_id = d.id " +
                     "JOIN companies c ON d.company_id = c.id " +
                     "WHERE a.status = 'SELECTED' " +
                     "GROUP BY c.id, c.name " +
                     "ORDER BY placed_students DESC LIMIT 5";
        return jdbcTemplate.queryForList(sql);
    }

    public int getTotalPlacedStudents() {
        String sql = "SELECT COUNT(DISTINCT student_id) FROM applications WHERE status = 'SELECTED'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    public Double getAveragePackage() {
        String sql = "SELECT AVG(d.package_lpa) FROM applications a JOIN drives d ON a.drive_id = d.id WHERE a.status = 'SELECTED'";
        Double avg = jdbcTemplate.queryForObject(sql, Double.class);
        return avg != null ? Math.round(avg * 100.0) / 100.0 : 0.0;
    }
}
