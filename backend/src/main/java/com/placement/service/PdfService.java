package com.placement.service;

import com.placement.model.Student;
import org.springframework.stereotype.Service;

@Service
public class PdfService {

    public byte[] generateResumePdf(Student student) {
        // Placeholder - implement with iText/OpenPDF when dependencies are resolved
        // For now, use frontend browser print to PDF functionality
        return null;
    }
}

