# TODO: Persist Resume Parse Data & Show in Profile

## Backend
- [x] Add `findById()` and `update()` methods to `StudentRepository.java`
- [x] Update `StudentController.parseResume()` to persist parsed data to DB
- [x] Create `resume_analyses` table for storing AI analysis history
- [x] Add comprehensive AI analysis fields (education, experience, projects, summary)
- [x] Create `ResumeAnalysis` model and repository

## Frontend
- [x] Add Skills & Certifications display to `Profile.jsx` info grid
- [x] Update global user state after successful parse so profile reflects new data
- [x] Display additional AI analysis results (education, experience, projects, summary)

