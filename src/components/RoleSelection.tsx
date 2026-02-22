import React from 'react';
import { GraduationCap, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelect: (role: 'student' | 'faculty') => void;
}

export default function RoleSelection({ onSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 mb-6">
          <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 mb-4">
          EduGuardian <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Empowering academic success through AI-driven risk prediction and personalized support.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Student Option */}
        <motion.button
          whileHover={{ scale: 1.02, translateY: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('student')}
          className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left overflow-hidden transition-all hover:border-indigo-200"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <GraduationCap className="w-32 h-32 text-indigo-600" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Student Portal</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Track your academic progress, view AI-generated study plans, and chat with your AI companion.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
              Enter Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>

        {/* Faculty Option */}
        <motion.button
          whileHover={{ scale: 1.02, translateY: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('faculty')}
          className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left overflow-hidden transition-all hover:border-emerald-200"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-32 h-32 text-emerald-600" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Faculty Dashboard</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Monitor student risk levels, analyze department performance, and manage interventions.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
              Access Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex items-center gap-2 text-slate-400 text-sm font-medium"
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
        Powered by Gemini AI for real-time predictive analytics
      </motion.div>
    </div>
  );
}
