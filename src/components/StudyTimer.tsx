import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          if (soundEnabled) {
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
          }
          // Switch mode
          if (mode === 'study') {
            setMode('break');
            setMinutes(5);
          } else {
            setMode('study');
            setMinutes(25);
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, soundEnabled]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'study' ? 25 : 5);
    setSeconds(0);
  };

  const progress = ((mode === 'study' ? 25 : 5) * 60 - (minutes * 60 + seconds)) / ((mode === 'study' ? 25 : 5) * 60) * 100;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-8">
        <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
          {mode === 'study' ? <Brain className="w-5 h-5 text-indigo-600" /> : <Coffee className="w-5 h-5 text-emerald-600" />}
          {mode === 'study' ? 'Focus Session' : 'Short Break'}
        </h3>
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={553}
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
            className={cn(
              "transition-all duration-1000",
              mode === 'study' ? "text-indigo-600" : "text-emerald-500"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-black text-slate-900">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            {mode === 'study' ? 'Keep Going' : 'Rest Time'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={resetTimer}
          className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleTimer}
          className={cn(
            "p-6 rounded-[2rem] text-white shadow-lg transition-all transform hover:scale-105 active:scale-95",
            isActive 
              ? "bg-slate-900 shadow-slate-200" 
              : mode === 'study' ? "bg-indigo-600 shadow-indigo-200" : "bg-emerald-600 shadow-emerald-200"
          )}
        >
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <div className="w-14" /> {/* Spacer to balance reset button */}
      </div>

      <div className="mt-8 flex gap-2 p-1 bg-slate-50 rounded-2xl w-full">
        <button 
          onClick={() => { setMode('study'); setMinutes(25); setSeconds(0); setIsActive(false); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
            mode === 'study' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Study
        </button>
        <button 
          onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false); }}
          className={cn(
            "flex-1 py-2 rounded-xl text-xs font-bold transition-all",
            mode === 'break' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Break
        </button>
      </div>
    </div>
  );
}
