package com.placement.repository;

import com.placement.model.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AdminRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Admin findByEmail(String email) {
        String sql = "SELECT * FROM admins WHERE email = ?";
        List<Admin> admins = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Admin.class), email);
        return admins.isEmpty() ? null : admins.get(0);
    }
}
