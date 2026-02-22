import React from 'react';
import { motion } from 'motion/react';

interface RiskGaugeProps {
  score: number;
  label: string;
}

export default function RiskGauge({ score, label }: RiskGaugeProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s > 60) return '#ef4444'; // red-500
    if (s > 30) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke={getColor(score)}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-slate-900">{Math.round(score)}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}
