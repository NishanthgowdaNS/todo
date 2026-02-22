import React from 'react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Award, 
  Users,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function CommunityHighlights() {
  const highlights = [
    {
      id: 1,
      user: "Alex Chen",
      action: "earned the 'Math Master' badge!",
      time: "2h ago",
      likes: 24,
      type: "achievement"
    },
    {
      id: 2,
      user: "Maria Garcia",
      action: "started a study group for 'Physics 101'",
      time: "4h ago",
      likes: 12,
      type: "social"
    },
    {
      id: 3,
      user: "EduGuardian AI",
      action: "helped 150 students lower their risk this week!",
      time: "6h ago",
      likes: 89,
      type: "system"
    }
  ];

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Community Highlights
        </h3>
        <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
      </div>

      <div className="space-y-6">
        {highlights.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              item.type === 'achievement' ? "bg-amber-50 text-amber-600" : 
              item.type === 'social' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
            )}>
              {item.type === 'achievement' ? <Award className="w-5 h-5" /> : 
               item.type === 'social' ? <MessageSquare className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className="flex-1 border-b border-slate-50 pb-4 group-last:border-0">
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900">{item.user}</span> {item.action}
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.time}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors">
                  <Heart className="w-3 h-3" />
                  {item.likes}
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-indigo-600 rounded-2xl text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">Join the Leaderboard</p>
            <p className="text-[10px] text-indigo-100">See how you rank among peers</p>
          </div>
        </div>
        <button className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
