package com.placement.service;

import com.placement.model.Drive;
import com.placement.model.Student;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShortlistingAlgorithm {

    public List<Student> shortlist(List<Student> eligibleStudents, Drive drive) {
        return eligibleStudents.stream()
                .sorted(Comparator.comparing(Student::getCgpa).reversed()
                        .thenComparing(this::calculateSkillScore).reversed())
                .collect(Collectors.toList());
    }
    
    private int calculateSkillScore(Student student) {
        int score = 0;
        if (student.getSkills() != null && !student.getSkills().trim().isEmpty()) {
            score += student.getSkills().split(",").length;
        }
        if (student.getCertifications() != null && !student.getCertifications().trim().isEmpty()) {
            score += student.getCertifications().split(",").length;
        }
        return score;
    }
}

