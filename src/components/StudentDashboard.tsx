import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  TrendingUp, 
  Clock, 
  BookOpen,
  RefreshCcw,
  Sparkles,
  GraduationCap,
  Users,
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Student, DashboardData, Intervention } from '../types';
import { cn, getRiskColor } from '../lib/utils';
import RiskGauge from './RiskGauge';
import AIChatbot from './AIChatbot';
import SuccessSimulator from './SuccessSimulator';
import GamificationCard from './GamificationCard';
import StudyTimer from './StudyTimer';
import CommunityHighlights from './CommunityHighlights';
import { generateIntervention } from '../services/geminiService';

const data = [
  { name: 'Mon', score: 85 },
  { name: 'Tue', score: 78 },
  { name: 'Wed', score: 82 },
  { name: 'Thu', score: 70 },
  { name: 'Fri', score: 65 },
  { name: 'Sat', score: 62 },
  { name: 'Sun', score: 60 },
];

export default function StudentDashboard({ user }: { user: Student }) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`/api/student/${user.id}/dashboard?t=${Date.now()}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user.id]);

  const handleRecalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id })
      });
      
      if (!res.ok) throw new Error('Failed to recalculate');
      
      await fetchDashboard();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to recalculate risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIPlan = async () => {
    if (!dashboardData) return;
    setGenerating(true);
    try {
      const plan = await generateIntervention(dashboardData);
      await fetch('/api/interventions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, content: plan })
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!dashboardData || !dashboardData.student) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Student Not Found</h2>
        <p className="text-slate-500 max-w-md">We couldn't retrieve the data for this student. Please try logging in again or contact support.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const risk = dashboardData.risk;
  const reasons = risk?.reasons ? JSON.parse(risk.reasons) : {};

  const handleSimulateActivity = async () => {
    setLoading(true);
    try {
      await fetch('/api/student/simulate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id })
      });
      await handleRecalculate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Risk score recalculated successfully!
          </motion.div>
        )}
        {selectedRisk && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedRisk(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-slate-900 capitalize">{selectedRisk} Risk Analysis</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detailed Breakdown</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedRisk(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-bold text-indigo-900">AI Analysis: Why this score?</h4>
                  </div>
                  <p className="text-indigo-800/80 leading-relaxed text-sm">
                    {reasons[selectedRisk.toLowerCase().replace(' risk', '')] || "No specific data available for this metric."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Key Indicators</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Score</p>
                      <p className="text-xl font-bold text-slate-900">
                        {Math.round(risk?.[`${selectedRisk.toLowerCase().replace(' risk', '')}_risk` as keyof typeof risk] as number || 0)}%
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className={cn(
                        "text-sm font-bold",
                        (risk?.[`${selectedRisk.toLowerCase().replace(' risk', '')}_risk` as keyof typeof risk] as number || 0) > 60 ? 'text-red-500' : 'text-emerald-500'
                      )}>
                        {(risk?.[`${selectedRisk.toLowerCase().replace(' risk', '')}_risk` as keyof typeof risk] as number || 0) > 60 ? 'Action Required' : 'Healthy'}
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedRisk(null)}
                  className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification & Welcome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-4xl font-display font-black tracking-tight text-slate-900">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-slate-500 mt-2 text-lg">You're doing great. Here's your academic status today.</p>
          </div>
          <GamificationCard student={dashboardData.student} />
        </div>
        <div className="lg:col-span-1">
          <StudyTimer />
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 border-t border-slate-100">
        <div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-slate-900">Risk Analysis</h2>
          <p className="text-slate-500 mt-1">Real-time academic performance and risk analysis</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSimulateActivity}
            className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Log Activity
          </button>
          <button 
            onClick={handleRecalculate}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Recalculate Risk
          </button>
          <button 
            onClick={handleGenerateAIPlan}
            disabled={generating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            <Sparkles className={cn("w-4 h-4", generating && "animate-pulse")} />
            {generating ? 'Generating Plan...' : 'AI Intervention'}
          </button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center"
        >
          <RiskGauge score={risk?.total_risk || 0} label="Overall Risk" />
          <div className={cn(
            "mt-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border",
            getRiskColor(risk?.classification || 'Safe')
          )}>
            {risk?.classification || 'Safe'}
          </div>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed">
            Your risk level is based on academic performance, behavioral trends, and emotional feedback.
          </p>
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Academic Risk', score: risk?.academic_risk || 0, icon: GraduationCap, color: 'text-blue-600' },
            { label: 'Behavioral Risk', score: risk?.behavioral_risk || 0, icon: Clock, color: 'text-purple-600' },
            { label: 'Emotional Risk', score: risk?.emotional_risk || 0, icon: BrainCircuit, color: 'text-pink-600' },
            { label: 'Social Risk', score: risk?.social_risk || 0, icon: Users, color: 'text-emerald-600' },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedRisk(item.label)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className={cn("p-3 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <Info className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{Math.round(item.score)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    className={cn("h-full rounded-full", 
                      item.score > 60 ? 'bg-red-500' : item.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                    )}
                  />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts and Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Chart */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Performance Trend
                </h3>
                <p className="text-sm text-slate-500">Daily academic score progression</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Success Simulator - Unique Feature */}
          <SuccessSimulator currentRisk={risk} />

          {/* AI Interventions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 px-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              AI-Powered Interventions
            </h3>
            <div className="space-y-4">
              {dashboardData?.interventions.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800">{item.type}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-line">
                    {item.content}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Active Plan</span>
                  </div>
                </motion.div>
              ))}
              {dashboardData?.interventions.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No active interventions. Generate one to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Chatbot & Community */}
        <div className="lg:col-span-1 space-y-8">
          <AIChatbot context={dashboardData} />
          <CommunityHighlights />
        </div>
      </div>
    </div>
  );
}
