const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

let students = [];
let subjects = [];
let subjectId = 1;
let tests = [];
let testId = 1;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/../frontend/"));

// Routes for serving HTML pages
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/create-student/index.html'));
});

app.get('/view-student', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view-student/index.html'));
});

app.get('/create-subject', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view-student/create-subject/index.html'));
});

app.get('/view-subject', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view-student/view-subject/index.html'));
});

app.get('/create-test', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view-student/create-subject/create-test/index.html'));
});

// API endpoints
app.post('/submit', (req, res) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password || !department) {
    return res.status(400).send("All fields are required.");
  }
  students.push({ name, email, password, department });
  res.json({ message: 'Student added successfully' });
});

app.get('/students', (req, res) => {
  const enrichedStudents = students.map((student, index) => {
    const studentSubjects = subjects.filter(s => s.studentIndex === index);
    let totalObtained = 0;
    let totalMarks = 0;

    studentSubjects.forEach(subject => {
      const subjectTests = tests.filter(test => test.subjectId === subject.id);
      subjectTests.forEach(test => {
        totalObtained += test.obtainedMarks;
        totalMarks += test.totalMarks;
      });
    });

    const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
    const grade = getGrade(percentage);

    return {
      ...student,
      grade,
      percentage: percentage.toFixed(2),
      totalObtained,
      totalMarks
    };
  });
  res.json(enrichedStudents);
});

app.get('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const student = students[index];
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const studentSubjects = subjects.filter(s => s.studentIndex === index);
  let totalObtained = 0;
  let totalMarks = 0;

  studentSubjects.forEach(subject => {
    const subjectTests = tests.filter(test => test.subjectId === subject.id);
    subjectTests.forEach(test => {
      totalObtained += test.obtainedMarks;
      totalMarks += test.totalMarks;
    });
  });

  const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
  const grade = getGrade(percentage);

  res.json({
    ...student,
    grade,
    percentage: percentage.toFixed(2),
    totalObtained,
    totalMarks
  });
});

app.put('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (!students[index]) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const { name, email, password, department } = req.body;
  students[index] = { name, email, password, department };
  res.json({ message: 'Student updated successfully' });
});

app.delete('/students/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (!students[index]) {
    return res.status(404).json({ error: 'Student not found' });
  }
  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

app.post('/subjects', (req, res) => {
  const { studentIndex, subName } = req.body;
  const id = subjectId++;
  subjects.push({ id, studentIndex: parseInt(studentIndex), subName });
  res.json({ message: 'Subject added' });
});

app.get('/subjects/:studentIndex', (req, res) => {
  const studentIndex = parseInt(req.params.studentIndex);
  const studentSubjects = subjects
    .filter(s => s.studentIndex === studentIndex)
    .map(subject => {
      const subjectTests = tests.filter(t => t.subjectId === subject.id);
      const obtained = subjectTests.reduce((sum, t) => sum + t.obtainedMarks, 0);
      const total = subjectTests.reduce((sum, t) => sum + t.totalMarks, 0);
      const percentage = total > 0 ? (obtained / total) * 100 : 0;
      return {
        ...subject,
        obtainedMarks: obtained,
        totalMarks: total,
        percentage: percentage.toFixed(2),
        grade: getGrade(percentage)
      };
    });
  res.json(studentSubjects);
});

app.put('/subjects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const subject = subjects.find(s => s.id === id);
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  const { subName } = req.body;
  if (!subName) {
    return res.status(400).json({ error: 'Subject name is required' });
  }
  subject.subName = subName;
  res.json({ message: 'Subject updated' });
});

app.delete('/subjects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = subjects.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Subject not found' });
  subjects.splice(index, 1);
  res.json({ message: 'Subject deleted successfully' });
});

app.get('/tests/:subjectId', (req, res) => {
  const subjectId = parseInt(req.params.subjectId);
  const subjectTests = tests.filter(test => test.subjectId === subjectId).map(test => {
    const percentage = (test.obtainedMarks / test.totalMarks) * 100;
    return {
      ...test,
      percentage: percentage.toFixed(2),
      grade: getGrade(percentage)
    };
  });
  res.json(subjectTests);
});

app.post('/tests', (req, res) => {
  const { studentIndex, subjectId, testTopic, obtainedMarks, totalMarks } = req.body;
  if (!testTopic || isNaN(obtainedMarks) || isNaN(totalMarks) || obtainedMarks > totalMarks || totalMarks <= 0) {
    return res.status(400).json({ error: 'Invalid test data' });
  }
  const newTest = {
    id: testId++,
    studentIndex: parseInt(studentIndex),
    subjectId: parseInt(subjectId),
    testTopic,
    obtainedMarks: parseFloat(obtainedMarks),
    totalMarks: parseFloat(totalMarks)
  };
  tests.push(newTest);
  res.json({ message: 'Test added successfully' });
});

app.put('/tests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const test = tests.find(t => t.id === id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  const { testTopic, obtainedMarks, totalMarks } = req.body;
  if (!testTopic || isNaN(obtainedMarks) || isNaN(totalMarks) || totalMarks <= 0 || obtainedMarks > totalMarks) {
    return res.status(400).json({ error: 'Invalid test data' });
  }
  test.testTopic = testTopic;
  test.obtainedMarks = parseFloat(obtainedMarks);
  test.totalMarks = parseFloat(totalMarks);
  res.json({ message: 'Test updated successfully' });
});

app.delete('/tests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tests.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Test not found' });
  }
  tests.splice(index, 1);
  res.json({ message: 'Test deleted successfully' });
});

function getGrade(percentage) {
  const p = parseFloat(percentage);
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
