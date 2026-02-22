export interface Student {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  gpa: number | null;
  attendance: number | null;
  semester: number | null;
  is_mentor: boolean;
  xp: number;
  level: number;
  achievements: string; // JSON string array
}

export interface RiskScore {
  student_id: string;
  academic_risk: number;
  behavioral_risk: number;
  emotional_risk: number;
  social_risk: number;
  total_risk: number;
  classification: 'Safe' | 'Medium Risk' | 'High Risk';
  last_updated: string;
  reasons: string; // JSON string
}

export interface Intervention {
  id: number;
  student_id: string;
  type: string;
  content: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface DashboardData {
  student: Student;
  records: any[];
  behavior: any;
  risk: RiskScore;
  interventions: Intervention[];
}
