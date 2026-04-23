package com.placement.model;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class Application {
    private Integer id;
    private Integer studentId;
    private Integer driveId;
    private ApplicationStatus status;
    private Timestamp appliedOn;
    
    private String studentName;
    private String companyName;
    private String role;
}
