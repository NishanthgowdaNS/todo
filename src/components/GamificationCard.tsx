import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Zap, 
  Award, 
  Target, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Student } from '../types';

export default function GamificationCard({ student }: { student: Student }) {
  if (!student) return null;

  const achievements = JSON.parse(student.achievements || '[]');
  const nextLevelXp = student.level * 500;
  const progress = (student.xp / nextLevelXp) * 100;

  const quests = [
    { id: 1, title: 'LMS Login', xp: 50, completed: true },
    { id: 2, title: 'Study for 2 Hours', xp: 100, completed: false },
    { id: 3, title: 'Help a Peer', xp: 150, completed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
              <span className="text-2xl font-display font-black">{student.level}</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-bold">Level {student.level}</h3>
              <p className="text-indigo-100 text-sm font-medium">Academic Explorer</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-amber-300">
              <Flame className="w-5 h-5 fill-current" />
              <span className="font-black text-xl">5</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Day Streak</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-100">
            <span>XP Progress</span>
            <span>{student.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(252,211,77,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Achievements & Quests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Achievements */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Badges
            </h4>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{achievements.length} Earned</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {achievements.map((badge: string) => (
              <div key={badge} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-bold border border-amber-100 flex items-center gap-1.5">
                <Award className="w-3 h-3" />
                {badge}
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="text-xs text-slate-400 italic">No badges yet. Keep going!</p>
            )}
          </div>
        </div>

        {/* Daily Quests */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" />
              Daily Quests
            </h4>
          </div>
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                    quest.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-200 group-hover:border-indigo-400"
                  )}>
                    {quest.completed && <Star className="w-3 h-3 text-white fill-current" />}
                  </div>
                  <span className={cn("text-xs font-medium", quest.completed ? "text-slate-400 line-through" : "text-slate-700")}>
                    {quest.title}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600">+{quest.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
