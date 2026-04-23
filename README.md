# 🚀 Smart Placement Management System

A robust, scalable, and premium platform designed to streamline and automate the campus placement process for both students and placement administrators. 

## 📖 Summary of the Application

The Smart Placement Management System is a full-stack web application designed to bridge the gap between students, colleges, and hiring companies. It replaces manual, spreadsheet-based placement tracking with an automated, data-driven platform. The system boasts a powerful Java Spring Boot backend featuring an intelligent eligibility engine and shortlisting algorithm, coupled with a visually stunning, responsive React frontend utilizing modern glassmorphism aesthetics and smooth animations.

## ✨ Features of the Application

### 🎓 Student Features:
- **Profile Management:** Register, update academic details, and maintain comprehensive profiles.
- **Company Discovery:** Browse active placement drives and company requirements.
- **One-Click Apply:** Seamlessly apply to eligible drives.
- **Application Tracking:** Track real-time status across different interview rounds (Applied → Shortlisted → Technical → HR → Placed).
- **Notifications & Alerts:** Get updates on upcoming rounds and application status changes.

### 🛡️ Admin / TPO (Training and Placement Officer) Features:
- **Drive Management:** Create and manage company drives with specific eligibility criteria.
- **Automated Eligibility Checking:** Core backend engine automatically filters students based on CGPA, branch, and backlogs.
- **Smart Shortlisting:** Algorithm-driven candidate sorting based on skills, academic performance, and criteria match.
- **Round Management:** Progress candidates through various stages (Aptitude, Technical, HR).
- **Analytics & Reporting:** Visual dashboard tracking total students, active applications, placement rates, and company statistics.

## 📂 Folder Structure

```
Smart Placement_Management_System/
├── backend/                  # Java Spring Boot Backend
│   ├── src/main/java/...     # Source Code (Controllers, Services, Models, Repositories)
│   ├── src/main/resources/   # Application properties & schema.sql
│   └── pom.xml               # Maven Dependencies
├── frontend/                 # React (Vite) Frontend
│   ├── public/               # Static Assets
│   ├── src/                  # React Source Code
│   │   ├── components/       # Reusable UI Components (Sidebar, Navbar, Layout)
│   │   ├── pages/            # Application Pages (Dashboard, Students, Companies, etc.)
│   │   ├── App.jsx           # Main React Router Component
│   │   └── index.css         # Premium Vanilla CSS Design System & Variables
│   ├── package.json          # NPM Dependencies
│   └── vite.config.js        # Vite Configuration
└── README.md                 # Project Documentation
```

## 🚀 How to Run

### Prerequisites
- Java 17+
- Maven
- MySQL Server (Running on default port 3306)
- Node.js (v18+) and npm

### 1. Database Setup
1. Open MySQL and create a database: `CREATE DATABASE placement_db;`
2. The Spring Boot backend will automatically execute `schema.sql` on startup to generate the tables.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Update `src/main/resources/application.properties` with your MySQL credentials (username and password).
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will start on `http://localhost:8080`*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible locally via the URL provided by Vite (typically `http://localhost:5173`)*
   *(Note: Ensure your OS allows native binary execution for the Vite bundler)*

## 🔮 Future Developments

- **AI Resume Parsing:** Integrate an AI engine to automatically extract skills and academic details from uploaded PDF resumes.
- **Mock Interview Bot:** Implement an LLM-based chatbot to help students practice technical and HR interviews within the platform.
- **Email & SMS Notifications:** Integrate SendGrid and Twilio for real-time notifications on shortlisting and drive announcements.
- **Alumni Mentorship Portal:** Create a module connecting current students with successfully placed alumni for guidance.

## ✍️ Author

**Anisha Paturi**  
A passionate developer focused on creating impactful, scalable software solutions with premium user experiences.
