import React, { useState, useEffect } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronRight, 
  Mail, 
  Bell,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Award,
  Link as LinkIcon,
  BrainCircuit,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Cell,
  Pie
} from 'recharts';
import { cn, getRiskColor } from '../lib/utils';

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function FacultyDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFacultyData = async () => {
    try {
      const res = await fetch('/api/faculty/dashboard');
      const data = await res.json();
      setStudents(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const riskStats = [
    { name: 'Safe', value: students.filter(s => s.classification === 'Safe').length },
    { name: 'Medium', value: students.filter(s => s.classification === 'Medium Risk').length },
    { name: 'High', value: students.filter(s => s.classification === 'High Risk').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Activity className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Faculty Oversight</h2>
          <p className="text-slate-500 mt-1">Global student risk monitoring and intervention analytics</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Risk Distribution
            </h3>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {riskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold flex items-center gap-2 self-start mb-8">
            <PieChartIcon className="w-5 h-5 text-indigo-600" />
            Risk Heatmap
          </h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskStats}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 w-full">
            {riskStats.map((stat, idx) => (
              <div key={stat.name} className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Student Roster
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {filteredStudents.length} Students</span>
            <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk Score</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        {student.is_mentor === 1 && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1 border-2 border-white shadow-sm" title="Certified Mentor">
                            <Award className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800">{student.name}</p>
                          {student.is_mentor === 1 && (
                            <span className="text-[8px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full border border-amber-100 uppercase tracking-tighter">Mentor</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      getRiskColor(student.classification || 'Safe')
                    )}>
                      {student.classification || 'Safe'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-24 overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", 
                            student.total_risk > 60 ? 'bg-red-500' : student.total_risk > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                          )}
                          style={{ width: `${student.total_risk || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{Math.round(student.total_risk || 0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">
                    {student.gpa?.toFixed(2) || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Activity className={cn("w-3 h-3", student.attendance < 75 ? 'text-red-500' : 'text-emerald-500')} />
                      <span className="text-sm font-bold text-slate-700">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {student.classification !== 'Safe' && (
                        <button className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors" title="Match with Mentor">
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors" title="Send Alert">
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors" title="Email Student">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Risk Engine Logic
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-sm font-medium text-slate-400">Academic Weight</span>
              <span className="font-bold text-indigo-400">40%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-sm font-medium text-slate-400">Behavioral Weight</span>
              <span className="font-bold text-purple-400">25%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-sm font-medium text-slate-400">Emotional Weight</span>
              <span className="font-bold text-pink-400">20%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-sm font-medium text-slate-400">Social Weight</span>
              <span className="font-bold text-emerald-400">15%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Integration Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Gemini 3.1 Pro</p>
                <p className="text-xs text-slate-500">Active for intervention generation and predictive reasoning.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Real-time Sync</p>
                <p className="text-xs text-slate-500">Socket.io active. Broadcasting risk updates to all portals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
