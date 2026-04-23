package com.placement.model;

import lombok.Data;
import java.sql.Date;

@Data
public class Drive {
    private Integer id;
    private Integer companyId;
    private String role;
    private Double packageLpa;
    private Double minCgpa;
    private String allowedBranches;
    private Date driveDate;
    
    private String companyName;
}
