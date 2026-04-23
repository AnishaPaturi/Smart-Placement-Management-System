package com.placement.model;

import lombok.Data;
import java.sql.Date;

@Data
public class Round {
    private Integer id;
    private Integer driveId;
    private String roundName;
    private Date roundDate;
}
