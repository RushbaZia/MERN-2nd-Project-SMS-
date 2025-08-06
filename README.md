🟩 Day 1 – Basic Form + Display in URL

Built a basic HTML form with:

Name, Email, Password, Department fields
Used GET method to:

Display submitted form data in the URL query string
Show submitted data on screen using JavaScript
No backend; everything was handled on the frontend.

🟩 Day 2 – Raw Node.js Backend Setup
Created a custom Node.js server (no Express).

Used POST method to:

Handle form submissions and store data in a global array
Created a second HTML page to:

Fetch and display student data in a table
Data was non-persistent (lost after server restart).

🟩 Day 3 – Express.js Integration + REST API
Migrated to Express.js for backend simplicity.

Set up the following RESTful routes:

POST /submit: Add student
GET /students: Get all students
PUT /students/:index: Update student
DELETE /students/:index: Delete student
Created show.html to:

List all students with Edit/Delete buttons
Added edit functionality using query string.

🟩 Day 4 – Dynamic Edit Form + Validations
Converted create-student/index.html form to:

Dynamic behavior using ?studentIndex=...
Fetch and pre-fill student data for editing
Submit button changes to Update when editing

Added form validations:

Required fields
Valid email format
Password length ≥ 8
Displayed alerts on validation or fetch errors

🟩 Day 5 – Folder Structure + Subject Details + View Page
Organized project folder structure:
src/ backend/ (index.js) frontend/ create-student/ view-student/ create-subject/

Changed default route / to load student list (index.html)

Created student detail page student.html with:

Table 1: Student info
Table 2: Subject list for that student
Edit/Delete/Update for subjects
Total marks, obtained marks, and percentage row
Created create-subject/index.html to add subject per student

Added Back Button on edit form

Fixed 404 path issues and made all URLs relative to new folder structure

🟩 Day 6 – Test Module, Subject View & Inline Edits
✅ Test Feature Added

Created full CRUD for tests linked to a subject:

POST /tests
GET /tests/:subjectId
PUT /tests/:id
DELETE /tests/:id
✅ view-subject Page Created

Displays:
Student Info (Table 1)
Subject Info (Table 2)
List of Tests (Table 3)
Linked from "View" button on subject list
✅ Inline Editing Implemented

Tests can now be edited directly in the table
Includes Save and Cancel features
Grade and percentage auto-calculated from backend after saving
✅ Navigation Fixes

Fixed bug in view-subject route: subjectId now passed and used correctly
Back and Add Test buttons work with studentIndex and subjectId
🟩 Day 7 – Backend Finalization, Grade Calculation, and Display Fixes
✅ Student Grade Fix (Server-side)

Grade and percentage now calculated dynamically on backend:

In /students route
In /students/:index route
Fixed display where grade was missing in:

index.html
view-student
view-subject
✅ Consistent Grade Rendering

Ensured grade is available and displayed in all views
Removed client-side grade logic completely
✅ Backend Code Review

Walked through entire index.js line-by-line:

Route purposes
Logic for computing marks, percentage, grade
CRUD flow for students, subjects, and tests
✅ Complete System Review

You now have:

Full stack system
Inline edits
Grade tracking
Clean routing & modular structure
✅ 7-Day Accomplishment Summary:
You built a mini full-stack student management app (no database) with:

✅ Node.js (Express.js) backend
✅ HTML/CSS/JS frontend
✅ Student, Subject, and Test modules
✅ Full CRUD (Create, Read, Update, Delete)
✅ Backend-based percentage and grade calculation
✅ Responsive and interactive UI
✅ Inline editing support for Subjects and Tests
