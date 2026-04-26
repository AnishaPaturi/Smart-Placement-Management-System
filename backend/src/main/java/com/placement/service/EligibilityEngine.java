package com.placement.service;

import com.placement.model.Drive;
import com.placement.model.Student;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EligibilityEngine {

    public List<Student> filterEligibleStudents(List<Student> allStudents, Drive drive) {
        return allStudents.stream()
                .filter(student -> isEligible(student, drive))
                .collect(Collectors.toList());
    }

    public boolean isEligible(Student student, Drive drive) {
        if (student.getCgpa() < drive.getMinCgpa()) {
            return false;
        }
        if (student.getActiveBacklogs() > 0) {
            return false;
        }
        
        List<String> allowedBranches = Arrays.asList(drive.getAllowedBranches().toUpperCase().split("\\s*,\\s*"));
        if (!allowedBranches.contains(student.getBranch().toUpperCase())) {
            return false;
        }
        return true;
    }
}

