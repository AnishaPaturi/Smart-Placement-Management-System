package com.placement.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeResume(MultipartFile file, String targetRole) {
        String resumeText = extractTextFromPdf(file);
        if (resumeText == null || resumeText.isEmpty()) {
            throw new RuntimeException("Could not extract text from the PDF.");
        }

        // Limit text to avoid huge token usage
        if (resumeText.length() > 10000) {
            resumeText = resumeText.substring(0, 10000);
        }

        String roleContext = (targetRole != null && !targetRole.trim().isEmpty()) 
                ? "The candidate is specifically targeting the role of: " + targetRole + ". Evaluate against this role."
                : "The candidate has not specified a role. Provide general professional feedback.";

        String systemPrompt = "You are an expert technical recruiter and resume reviewer. Analyze the provided resume text. " +
                roleContext + " " +
                "You MUST respond ONLY with a raw JSON object and absolutely no markdown formatting or extra text. " +
                "The JSON must have this exact structure: " +
                "{ \"feedback\": [\"bullet 1\", \"bullet 2\"], " +
                "\"suggestions\": [\"actionable step 1\", \"actionable step 2\"], " +
                "\"currentMatchPercent\": 65, \"optimizedMatchPercent\": 90, " +
                "\"detectedSkills\": \"Skill1, Skill2, Skill3\" }";

        return callOpenRouter(resumeText, systemPrompt, 800);
    }

    public Map<String, Object> parseResumeForProfile(MultipartFile file) {
        String resumeText = extractTextFromPdf(file);
        if (resumeText == null || resumeText.isEmpty()) {
            throw new RuntimeException("Could not extract text from the PDF.");
        }

        // Limit text to avoid huge token usage
        if (resumeText.length() > 10000) {
            resumeText = resumeText.substring(0, 10000);
        }

        String systemPrompt = "You are an expert resume parser. Extract structured information from the resume text. " +
                "You MUST respond ONLY with a raw JSON object and absolutely no markdown formatting or extra text. " +
                "The JSON must have this exact structure: " +
                "{ " +
                "\"skills\": \"Skill1, Skill2, Skill3\", " +
                "\"certifications\": \"Cert1, Cert2\", " +
                "\"cgpa\": 8.5, " +
                "\"education\": \"B.Tech in Computer Science, XYZ University (2022-2026)\", " +
                "\"experience\": \"Software Intern at ABC Tech (Jun 2025 - Dec 2025)\", " +
                "\"projects\": \"Project1, Project2\", " +
                "\"summary\": \"Brief professional summary\" }";

        return callOpenRouter(resumeText, systemPrompt, 1000);
    }

    private Map<String, Object> callOpenRouter(String resumeText, String systemPrompt, int maxTokens) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "google/gemini-2.5-flash");
        requestBody.put("max_tokens", maxTokens);

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "Here is the resume text:\n" + resumeText);

        requestBody.put("messages", new Object[]{systemMessage, userMessage});

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://localhost:5173");
        headers.set("X-Title", "Smart Placement System");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(OPENROUTER_URL, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String aiMessage = root.path("choices").get(0).path("message").path("content").asText();

                // Clean up potential markdown formatting if the model disobeys
                if (aiMessage.startsWith("```json")) {
                    aiMessage = aiMessage.substring(7);
                }
                if (aiMessage.startsWith("```")) {
                    aiMessage = aiMessage.substring(3);
                }
                if (aiMessage.endsWith("```")) {
                    aiMessage = aiMessage.substring(0, aiMessage.length() - 3);
                }

                return objectMapper.readValue(aiMessage.trim(), Map.class);
            } else {
                throw new RuntimeException("API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error calling OpenRouter: " + e.getMessage());
            throw new RuntimeException("Failed to analyze resume via AI.", e);
        }
    }

    private String extractTextFromPdf(MultipartFile file) {
        try (InputStream is = file.getInputStream();
             PDDocument document = PDDocument.load(is)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            System.err.println("Error reading PDF: " + e.getMessage());
            return null;
        }
    }

    public Map<String, Object> analyzeATS(MultipartFile file, String jobDescription) {
        String resumeText = extractTextFromPdf(file);
        if (resumeText == null || resumeText.isEmpty()) {
            throw new RuntimeException("Could not extract text from the PDF.");
        }

        // Limit text to avoid huge token usage
        if (resumeText.length() > 10000) {
            resumeText = resumeText.substring(0, 10000);
        }

        String systemPrompt = "You are an expert ATS (Applicant Tracking System) resume analyzer. " +
                "Analyze the provided resume against the job description. " +
                "You MUST respond ONLY with a raw JSON object and absolutely no markdown formatting or extra text. " +
                "The JSON must have this exact structure: " +
                "{ " +
                "\"atsScore\": 75, " +
                "\"overallFeedback\": \"Brief overall assessment\", " +
                "\"sectionScores\": {" +
                "  \"formatting\": 80, " +
                "  \"keywords\": 70, " +
                "  \"readability\": 85, " +
                "  \"experienceMatch\": 75, " +
                "  \"skillsMatch\": 65, " +
                "  \"educationMatch\": 90" +
                "}, " +
                "\"missingKeywords\": [\"Keyword1\", \"Keyword2\"], " +
                "\"matchedKeywords\": [\"Keyword1\", \"Keyword2\"], " +
                "\"suggestions\": [" +
                "  \"Add missing keyword X to your skills section\", " +
                "  \"Quantify your achievements with numbers\"" +
                "], " +
                "\"strengths\": [" +
                "  \"Strong educational background\", " +
                "  \"Relevant work experience\"" +
                "], " +
                "\"weaknesses\": [" +
                "  \"Missing key skills\", " +
                "  \"Resume too long\"" +
                "]" +
                "}";

        // Call AI with both resume and job description
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "google/gemini-2.5-flash");
        requestBody.put("max_tokens", 1500);

        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", systemPrompt);

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content",
                "RESUME TEXT:\n" + resumeText + "\n\n" +
                "JOB DESCRIPTION:\n" + (jobDescription != null && !jobDescription.isEmpty() ? jobDescription : "General software engineering position"));

        requestBody.put("messages", new Object[]{systemMessage, userMessage});

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://localhost:5173");
        headers.set("X-Title", "Smart Placement System");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(OPENROUTER_URL, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String aiMessage = root.path("choices").get(0).path("message").path("content").asText();

                // Clean up potential markdown formatting
                if (aiMessage.startsWith("```json")) {
                    aiMessage = aiMessage.substring(7);
                }
                if (aiMessage.startsWith("```")) {
                    aiMessage = aiMessage.substring(3);
                }
                if (aiMessage.endsWith("```")) {
                    aiMessage = aiMessage.substring(0, aiMessage.length() - 3);
                }

                Map<String, Object> result = objectMapper.readValue(aiMessage.trim(), Map.class);

                // Ensure atsScore is a proper number
                if (result.get("atsScore") instanceof Number) {
                    result.put("atsScore", ((Number) result.get("atsScore")).intValue());
                } else {
                    result.put("atsScore", 0);
                }

                return result;
            } else {
                throw new RuntimeException("API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error calling OpenRouter for ATS: " + e.getMessage());
            throw new RuntimeException("Failed to analyze ATS resume.", e);
        }
    }
}

