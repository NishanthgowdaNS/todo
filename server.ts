import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("eduguardian.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'student',
    gpa REAL,
    attendance REAL,
    semester INTEGER,
    is_mentor BOOLEAN DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    achievements TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS peer_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    interaction_type TEXT, -- 'forum_post', 'peer_review', 'study_group'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    subject TEXT,
    marks INTEGER,
    assignment_delay INTEGER,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS behavior_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    lms_logins INTEGER,
    study_hours REAL,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS emotional_surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    stress_level INTEGER,
    motivation_score INTEGER,
    feedback TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS risk_scores (
    student_id TEXT PRIMARY KEY,
    academic_risk REAL,
    behavioral_risk REAL,
    emotional_risk REAL,
    social_risk REAL,
    total_risk REAL,
    classification TEXT,
    reasons TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS interventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    type TEXT,
    content TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );
`);

try {
  db.prepare("ALTER TABLE students ADD COLUMN xp INTEGER DEFAULT 0").run();
  db.prepare("ALTER TABLE students ADD COLUMN level INTEGER DEFAULT 1").run();
  db.prepare("ALTER TABLE students ADD COLUMN achievements TEXT DEFAULT '[]'").run();
} catch (e) {}

try {
  db.prepare("ALTER TABLE risk_scores ADD COLUMN reasons TEXT").run();
} catch (e) {
  // Column already exists
}

// Seed Demo Data if empty
const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
if (studentCount.count === 0) {
  const insertStudent = db.prepare("INSERT INTO students (id, name, email, role, gpa, attendance, semester) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const insertRecord = db.prepare("INSERT INTO academic_records (student_id, subject, marks, assignment_delay) VALUES (?, ?, ?, ?)");
  const insertBehavior = db.prepare("INSERT INTO behavior_logs (student_id, lms_logins, study_hours) VALUES (?, ?, ?)");
  
  // Faculty
  insertStudent.run("fac-1", "Dr. Sarah Smith", "sarah.smith@edu.com", "faculty", null, null, null);
  
  // High Risk Student
  insertStudent.run("std-1", "John Doe", "john.doe@student.com", "student", 2.1, 65.0, 3);
  insertRecord.run("std-1", "Mathematics", 45, 5);
  insertRecord.run("std-1", "Physics", 50, 3);
  insertBehavior.run("std-1", 12, 15.5);
  
  // Medium Risk Student
  insertStudent.run("std-2", "Jane Wilson", "jane.wilson@student.com", "student", 3.2, 82.0, 3);
  insertRecord.run("std-2", "Mathematics", 78, 1);
  insertRecord.run("std-2", "Physics", 82, 0);
  insertBehavior.run("std-2", 45, 28.0);

  // Safe Student
  insertStudent.run("std-3", "Mike Ross", "mike.ross@student.com", "student", 3.9, 98.0, 3);
  insertRecord.run("std-3", "Mathematics", 95, 0);
  insertRecord.run("std-3", "Physics", 92, 0);
  insertBehavior.run("std-3", 88, 42.0);

  // New: Emotional Risk Student
  insertStudent.run("std-4", "Sarah Connor", "sarah.c@student.com", "student", 3.5, 90.0, 3);
  insertRecord.run("std-4", "Mathematics", 85, 0);
  insertBehavior.run("std-4", 60, 30.0);
  db.prepare("INSERT INTO emotional_surveys (student_id, stress_level, motivation_score, feedback) VALUES (?, ?, ?, ?)").run("std-4", 9, 2, "Feeling very overwhelmed with the current workload.");

  // New: Social Risk Student
  insertStudent.run("std-5", "Kyle Reese", "kyle.r@student.com", "student", 2.8, 70.0, 2);
  insertRecord.run("std-5", "History", 60, 2);
  insertBehavior.run("std-5", 30, 20.0);

  // New: High Risk Academic Student
  insertStudent.run("std-6", "T-800", "t800@student.com", "student", 1.5, 40.0, 1);
  insertRecord.run("std-6", "Ethics", 20, 10);
  insertBehavior.run("std-6", 5, 2.0);

  // More Demo Students
  insertStudent.run("std-7", "Alice Wonder", "alice@student.com", "student", 3.8, 95.0, 2);
  insertRecord.run("std-7", "Literature", 92, 0);
  insertBehavior.run("std-7", 75, 35.0);

  insertStudent.run("std-8", "Bob Builder", "bob@student.com", "student", 2.5, 75.0, 1);
  insertRecord.run("std-8", "Engineering", 55, 4);
  insertBehavior.run("std-8", 25, 12.0);

  // Seed Peer Interactions
  const insertPeer = db.prepare("INSERT INTO peer_interactions (student_id, interaction_type) VALUES (?, ?)");
  insertPeer.run("std-3", "forum_post");
  insertPeer.run("std-3", "peer_review");
  insertPeer.run("std-3", "study_group");
  insertPeer.run("std-2", "forum_post");

  // Set Mentors
  db.prepare("UPDATE students SET is_mentor = 1 WHERE id = 'std-3'").run();
  
  // Update some students with XP and achievements for demo
  db.prepare("UPDATE students SET xp = 450, level = 2, achievements = ? WHERE id = 'std-3'").run(JSON.stringify(['LMS Legend', 'Peer Helper']));
  db.prepare("UPDATE students SET xp = 120, level = 1, achievements = ? WHERE id = 'std-2'").run(JSON.stringify(['Early Bird']));
}

const calculateRisk = (studentId: string) => {
  console.log(`Calculating risk for student: ${studentId}`);
  try {
    const records = db.prepare("SELECT AVG(marks) as avg_marks, SUM(assignment_delay) as delays FROM academic_records WHERE student_id = ?").get(studentId) as any;
    const behavior = db.prepare("SELECT * FROM behavior_logs WHERE student_id = ?").get(studentId) as any;
    const emotional = db.prepare("SELECT * FROM emotional_surveys WHERE student_id = ? ORDER BY timestamp DESC LIMIT 1").get(studentId) as any;
    const social = db.prepare("SELECT COUNT(*) as count FROM peer_interactions WHERE student_id = ?").get(studentId) as any;

    console.log(`Data found for ${studentId}:`, { records, behavior, emotional, social });

    const academicRisk = Math.max(0, 100 - (records?.avg_marks || 0));
    const behavioralRisk = Math.max(0, 100 - ((behavior?.lms_logins || 0) + (behavior?.study_hours || 0)));
    const emotionalRisk = emotional ? (emotional.stress_level * 10) : 20;
    const socialRisk = Math.max(0, 100 - ((social?.count || 0) * 25));

    const totalRisk = (0.4 * academicRisk) + (0.25 * behavioralRisk) + (0.2 * emotionalRisk) + (0.15 * socialRisk);
    let classification = "Safe";
    if (totalRisk > 60) classification = "High Risk";
    else if (totalRisk > 30) classification = "Medium Risk";

    const reasons = {
      academic: academicRisk > 30 ? `Average marks are low (${Math.round(records?.avg_marks || 0)}%) and there are ${records?.delays || 0} assignment delays.` : "Academic performance is stable.",
      behavioral: behavioralRisk > 30 ? `Low LMS engagement (${behavior?.lms_logins || 0} logins) and below average study hours (${behavior?.study_hours || 0}h).` : "Engagement levels are healthy.",
      emotional: emotionalRisk > 50 ? `High stress levels reported (${emotional?.stress_level}/10) with feedback: "${emotional?.feedback}".` : "No significant emotional distress reported.",
      social: socialRisk > 40 ? `Limited peer interaction detected (${social?.count || 0} recent activities). Social isolation is a risk factor.` : "Active participation in peer learning networks."
    };

    const result = db.prepare(`
      INSERT OR REPLACE INTO risk_scores (student_id, academic_risk, behavioral_risk, emotional_risk, social_risk, total_risk, classification, reasons, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(studentId, academicRisk, behavioralRisk, emotionalRisk, socialRisk, totalRisk, classification, JSON.stringify(reasons));
    
    console.log(`Risk score updated for ${studentId}. Changes: ${result.changes}`);
  } catch (err) {
    console.error(`Error calculating risk for ${studentId}:`, err);
    throw err;
  }
};

// Always ensure risk scores exist for students on startup
const ensureRiskScores = () => {
  const allStudents = db.prepare("SELECT id FROM students WHERE role = 'student'").all() as { id: string }[];
  allStudents.forEach(s => calculateRisk(s.id));
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  const PORT = 3000;

  // API Routes
  app.use(express.json());

  // Ensure risk scores are ready
  try {
    ensureRiskScores();
  } catch (err) {
    console.error("Error during initial risk calculation:", err);
  }

  app.post("/api/login", (req, res) => {
    const { email } = req.body;
    const user = db.prepare("SELECT * FROM students WHERE email = ?").get(email) as any;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "User not found" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, role } = req.body;
    
    try {
      const id = role === 'student' ? `std-${Math.floor(Math.random() * 10000)}` : `fac-${Math.floor(Math.random() * 10000)}`;
      
      db.prepare("INSERT INTO students (id, name, email, role, gpa, attendance, semester) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(id, name, email, role, role === 'student' ? 3.0 : null, role === 'student' ? 100.0 : null, role === 'student' ? 1 : null);
      
      if (role === 'student') {
        // Initialize default behavior and academic records for new students
        db.prepare("INSERT INTO behavior_logs (student_id, lms_logins, study_hours) VALUES (?, ?, ?)").run(id, 0, 0);
        calculateRisk(id);
      }
      
      const user = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
      res.json(user);
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: "Email already registered" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/student/simulate-activity", (req, res) => {
    const { studentId } = req.body;
    console.log(`Simulating activity for ${studentId}`);
    try {
      // Add a random academic record with VERY high marks
      const subjects = ["Mathematics", "Physics", "Literature", "History", "Computer Science"];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const marks = 100; // Perfect score to force change
      db.prepare("INSERT INTO academic_records (student_id, subject, marks, assignment_delay) VALUES (?, ?, ?, ?)").run(studentId, subject, marks, 0);
      
      // Update behavior logs significantly, handle missing rows
      const result = db.prepare("UPDATE behavior_logs SET lms_logins = lms_logins + 50, study_hours = study_hours + 20 WHERE student_id = ?").run(studentId);
      if (result.changes === 0) {
        db.prepare("INSERT INTO behavior_logs (student_id, lms_logins, study_hours) VALUES (?, ?, ?)").run(studentId, 50, 20);
      }
      
      console.log(`Activity simulated for ${studentId}`);
      res.json({ success: true });
    } catch (err) {
      console.error("Simulation failed:", err);
      res.status(500).json({ error: "Failed to simulate activity" });
    }
  });

  app.get("/api/student/:id/dashboard", (req, res) => {
    const { id } = req.params;
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(id);
    const records = db.prepare("SELECT * FROM academic_records WHERE student_id = ?").all(id);
    const behavior = db.prepare("SELECT * FROM behavior_logs WHERE student_id = ?").get(id);
    const risk = db.prepare("SELECT * FROM risk_scores WHERE student_id = ?").get(id);
    const interventions = db.prepare("SELECT * FROM interventions WHERE student_id = ? ORDER BY created_at DESC").all(id);
    const emotional = db.prepare("SELECT * FROM emotional_surveys WHERE student_id = ? ORDER BY timestamp DESC LIMIT 1").get(id);
    
    res.json({ student, records, behavior, risk, interventions, emotional });
  });

  app.get("/api/faculty/dashboard", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, r.total_risk, r.classification 
      FROM students s 
      LEFT JOIN risk_scores r ON s.id = r.student_id 
      WHERE s.role = 'student'
    `).all();
    res.json({ students });
  });

  app.post("/api/risk/calculate", (req, res) => {
    const { studentId } = req.body;
    
    try {
      calculateRisk(studentId);
      const updatedRisk = db.prepare("SELECT * FROM risk_scores WHERE student_id = ?").get(studentId);
      io.emit("risk_update", { studentId, risk: updatedRisk });
      res.json(updatedRisk);
    } catch (err) {
      console.error("Manual risk calculation failed:", err);
      res.status(500).json({ error: "Failed to recalculate risk" });
    }
  });

  app.post("/api/interventions/generate", async (req, res) => {
    const { studentId } = req.body;
    // In a real app, this would call Gemini. For now, we'll return a placeholder
    // and implement the Gemini service in the next step.
    const content = `7-Day Study Plan for Student ${studentId}:\n1. Review Mathematics fundamentals.\n2. Complete pending assignments.\n3. Join peer study group.`;
    
    db.prepare("INSERT INTO interventions (student_id, type, content) VALUES (?, ?, ?)").run(studentId, "AI Study Plan", content);
    
    const newIntervention = db.prepare("SELECT * FROM interventions WHERE student_id = ? ORDER BY created_at DESC LIMIT 1").get(studentId);
    res.json(newIntervention);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
  });

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> EduGuardian AI Server Started <<<`);
    console.log(`>>> Port: ${PORT}`);
    console.log(`>>> Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

console.log("Starting EduGuardian AI Server...");
startServer().catch(err => {
  console.error("FAILED TO START SERVER:", err);
});
