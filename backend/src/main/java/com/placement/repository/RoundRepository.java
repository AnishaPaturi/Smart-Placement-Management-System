package com.placement.repository;

import com.placement.model.Round;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoundRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Round round) {
        String sql = "INSERT INTO rounds (drive_id, round_name, round_date) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, round.getDriveId(), round.getRoundName(), round.getRoundDate());
    }

    public List<Round> findByDriveId(int driveId) {
        String sql = "SELECT * FROM rounds WHERE drive_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Round.class), driveId);
    }
}
