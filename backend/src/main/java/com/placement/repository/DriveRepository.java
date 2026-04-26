package com.placement.repository;

import com.placement.model.Drive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DriveRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Drive drive) {
        String sql = "INSERT INTO drives (company_id, role, package_lpa, min_cgpa, allowed_branches, drive_date) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, drive.getCompanyId(), drive.getRole(), drive.getPackageLpa(),
                                   drive.getMinCgpa(), drive.getAllowedBranches(), drive.getDriveDate());
    }

    public List<Drive> findAll() {
        String sql = "SELECT d.*, c.name as company_name FROM drives d JOIN companies c ON d.company_id = c.id";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Drive.class));
    }

    public Drive findById(int id) {
        String sql = "SELECT d.*, c.name as company_name FROM drives d JOIN companies c ON d.company_id = c.id WHERE d.id = ?";
        List<Drive> drives = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Drive.class), id);
        return drives.isEmpty() ? null : drives.get(0);
    }

    public int update(Drive drive) {
        String sql = "UPDATE drives SET company_id = ?, role = ?, package_lpa = ?, min_cgpa = ?, allowed_branches = ?, drive_date = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
                drive.getCompanyId(), drive.getRole(), drive.getPackageLpa(),
                drive.getMinCgpa(), drive.getAllowedBranches(), drive.getDriveDate(), drive.getId());
    }

    public int delete(int id) {
        String sql = "DELETE FROM drives WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}

