package com.placement.controller;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Student student) {
        studentRepository.save(student);
        return ResponseEntity.ok("Student registered successfully");
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping("/{id}/parse-resume")
    public ResponseEntity<Map<String, Object>> parseResume(
            @PathVariable int id, 
            @RequestParam("file") MultipartFile file) throws InterruptedException {
        
        // Simulate AI Parsing Delay
        Thread.sleep(2000);
        
        // Mock parsed data
        Map<String, Object> parsedData = new HashMap<>();
        parsedData.put("skills", "Java, React, Spring Boot, SQL, AWS");
        parsedData.put("certifications", "AWS Certified Developer, Oracle Java SE 11");
        parsedData.put("cgpa", 8.8);
        parsedData.put("success", true);
        parsedData.put("message", "Resume parsed successfully by AI Engine.");
        
        // In a real application, you would update the student record in the DB here
        
        return ResponseEntity.ok(parsedData);
    }
}
