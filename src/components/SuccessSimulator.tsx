import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  Clock, 
  LogIn, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SuccessSimulatorProps {
  currentRisk: any;
}

export default function SuccessSimulator({ currentRisk }: SuccessSimulatorProps) {
  const [studyHours, setStudyHours] = useState(20);
  const [logins, setLogins] = useState(15);
  const [peerActivities, setPeerActivities] = useState(2);
  const [simulatedRisk, setSimulatedRisk] = useState(currentRisk?.total_risk || 0);

  useEffect(() => {
    // Basic simulation logic matching server-side weights
    const academicRisk = currentRisk?.academic_risk || 50;
    const emotionalRisk = currentRisk?.emotional_risk || 30;
    
    // Behavioral risk simulation
    const behavioralRisk = Math.max(0, 100 - (logins + studyHours));
    // Social risk simulation
    const socialRisk = Math.max(0, 100 - (peerActivities * 25));

    const total = (0.4 * academicRisk) + (0.25 * behavioralRisk) + (0.2 * emotionalRisk) + (0.15 * socialRisk);
    setSimulatedRisk(total);
  }, [studyHours, logins, peerActivities, currentRisk]);

  const diff = simulatedRisk - (currentRisk?.total_risk || 0);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Success Path Simulator
          </h3>
          <p className="text-sm text-slate-500">Tweak your habits to see your future risk projection</p>
        </div>
        <div className={cn(
          "px-4 py-2 rounded-2xl font-bold flex items-center gap-2",
          diff < 0 ? "bg-emerald-50 text-emerald-600" : diff > 0 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-400"
        )}>
          {diff < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {Math.abs(Math.round(diff))}% Change
        </div>
      </div>

      <div className="space-y-8">
        {/* Study Hours Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">Weekly Study Hours</span>
            </div>
            <span className="text-sm font-mono font-bold text-indigo-600">{studyHours}h</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="60" 
            value={studyHours} 
            onChange={(e) => setStudyHours(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* LMS Logins Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-bold text-slate-700">Weekly LMS Logins</span>
            </div>
            <span className="text-sm font-mono font-bold text-purple-600">{logins}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={logins} 
            onChange={(e) => setLogins(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* Peer Activities Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">Peer Interactions</span>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-600">{peerActivities}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={peerActivities} 
            onChange={(e) => setPeerActivities(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        <div className="pt-8 border-t border-slate-100">
          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Projected Risk Score</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-display font-bold">{Math.round(simulatedRisk)}%</span>
              <div className={cn(
                "mb-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                simulatedRisk > 60 ? "bg-red-500/20 text-red-400" : simulatedRisk > 30 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
              )}>
                {simulatedRisk > 60 ? "High Risk" : simulatedRisk > 30 ? "Medium Risk" : "Safe"}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              {simulatedRisk < (currentRisk?.total_risk || 0) 
                ? "Great progress! These changes would significantly lower your academic risk profile."
                : "Try increasing your engagement metrics to see how your risk score improves."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
