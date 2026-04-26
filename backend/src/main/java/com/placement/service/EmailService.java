// package com.placement.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import jakarta.mail.SimpleMailMessage;
// import jakarta.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// @Service
// public class EmailService {

//     @Autowired
//     private JavaMailSender mailSender;

//     public void sendEmail(String to, String subject, String body) {
//         try {
//             SimpleMailMessage message = new SimpleMailMessage();
//             message.setTo(to);
//             message.setSubject(subject);
//             message.setText(body);
//             mailSender.send(message);
//         } catch (Exception e) {
//             System.err.println("Failed to send email: " + e.getMessage());
//         }
//     }

//     public void sendApplicationStatusUpdate(String studentEmail, String studentName, String company, String newStatus) {
//         String subject = "Application Status Update - " + company;
//         String body = "Dear " + studentName + ",\n\n" +
//                 "Your application status for " + company + " has been updated to: " + newStatus + "\n\n" +
//                 "Please log in to your dashboard for more details.\n\n" +
//                 "Best regards,\nSmart Placement Team";
//         sendEmail(studentEmail, subject, body);
//     }

//     public void sendInterviewSchedule(String studentEmail, String studentName, String company, String round, String dateTime) {
//         String subject = "Interview Scheduled - " + company;
//         String body = "Dear " + studentName + ",\n\n" +
//                 "Your interview has been scheduled:\n" +
//                 "Company: " + company + "\n" +
//                 "Round: " + round + "\n" +
//                 "Date & Time: " + dateTime + "\n\n" +
//                 "Please be prepared and log in 5 minutes early.\n\n" +
//                 "Best regards,\nSmart Placement Team";
//         sendEmail(studentEmail, subject, body);
//     }

//     public void sendDriveAnnouncement(String studentEmail, String studentName, String company, String role, String minCgpa) {
//         String subject = "New Placement Drive - " + company;
//         String body = "Dear " + studentName + ",\n\n" +
//                 "A new placement drive has been announced:\n" +
//                 "Company: " + company + "\n" +
//                 "Role: " + role + "\n" +
//                 "Minimum CGPA Required: " + minCgpa + "\n\n" +
//                 "Log in to your dashboard to apply.\n\n" +
//                 "Best regards,\nSmart Placement Team";
//         sendEmail(studentEmail, subject, body);
//     }
// }

package com.placement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendApplicationStatusUpdate(String studentEmail, String studentName, String company, String newStatus) {
        String subject = "Application Status Update - " + company;
        String body = "Dear " + studentName + ",\n\n" +
                "Your application status for " + company + " has been updated to: " + newStatus + "\n\n" +
                "Please log in to your dashboard for more details.\n\n" +
                "Best regards,\nSmart Placement Team";
        sendEmail(studentEmail, subject, body);
    }

    public void sendInterviewSchedule(String studentEmail, String studentName, String company, String round, String dateTime) {
        String subject = "Interview Scheduled - " + company;
        String body = "Dear " + studentName + ",\n\n" +
                "Your interview has been scheduled:\n" +
                "Company: " + company + "\n" +
                "Round: " + round + "\n" +
                "Date & Time: " + dateTime + "\n\n" +
                "Please be prepared and log in 5 minutes early.\n\n" +
                "Best regards,\nSmart Placement Team";
        sendEmail(studentEmail, subject, body);
    }

    public void sendDriveAnnouncement(String studentEmail, String studentName, String company, String role, String minCgpa) {
        String subject = "New Placement Drive - " + company;
        String body = "Dear " + studentName + ",\n\n" +
                "A new placement drive has been announced:\n" +
                "Company: " + company + "\n" +
                "Role: " + role + "\n" +
                "Minimum CGPA Required: " + minCgpa + "\n\n" +
                "Log in to your dashboard to apply.\n\n" +
                "Best regards,\nSmart Placement Team";
        sendEmail(studentEmail, subject, body);
    }
}