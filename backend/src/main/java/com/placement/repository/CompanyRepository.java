package com.placement.repository;

import com.placement.model.Company;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompanyRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Company company) {
        String sql = "INSERT INTO companies (name, description, website) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, company.getName(), company.getDescription(), company.getWebsite());
    }

    public List<Company> findAll() {
        String sql = "SELECT * FROM companies";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Company.class));
    }
}
