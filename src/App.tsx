import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  LayoutDashboard, 
  Users, 
  AlertTriangle, 
  MessageSquare, 
  LogOut, 
  GraduationCap,
  TrendingUp,
  Clock,
  BookOpen,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student, DashboardData } from './types';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';

const socket = io();

export default function App() {
  const [user, setUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | null>(null);

  const handleLogin = (userData: Student) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRole(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && (
          <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight">EduGuardian <span className="text-indigo-600">AI</span></h1>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Student Risk Prediction</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-semibold leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        )}

        <main className="flex-1">
          <Routes>
            <Route 
              path="/login" 
              element={
                !user ? (
                  selectedRole ? (
                    <Login 
                      onLogin={handleLogin} 
                      selectedRole={selectedRole} 
                      onBack={() => setSelectedRole(null)} 
                    />
                  ) : (
                    <RoleSelection onSelect={setSelectedRole} />
                  )
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  user.role === 'faculty' ? <FacultyDashboard /> : <StudentDashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
