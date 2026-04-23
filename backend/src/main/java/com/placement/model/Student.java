package com.placement.model;

import lombok.Data;

@Data
public class Student {
    private Integer id;
    private String name;
    private String email;
    private String password;
    private Double cgpa;
    private String branch;
    private Integer activeBacklogs;
    private String skills;
    private String certifications;
    private String resumeUrl;
}
