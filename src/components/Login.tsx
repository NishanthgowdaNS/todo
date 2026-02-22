import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Mail, Lock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Login({ onLogin, selectedRole, onBack }: { 
  onLogin: (user: any) => void; 
  selectedRole: 'student' | 'faculty';
  onBack: () => void;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState(selectedRole === 'student' ? 'john.doe@student.com' : 'sarah.smith@edu.com');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const endpoint = isRegister ? '/api/register' : '/api/login';
    const payload = isRegister ? { email, name, role: selectedRole } : { email };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <button 
            onClick={onBack}
            className="mb-8 text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 mx-auto transition-colors"
          >
            ← Back to Role Selection
          </button>
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-xl mb-6",
            selectedRole === 'student' ? "bg-indigo-600 shadow-indigo-200" : "bg-emerald-600 shadow-emerald-200"
          )}>
            {selectedRole === 'student' ? <GraduationCap className="text-white w-8 h-8" /> : <Users className="text-white w-8 h-8" />}
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight mb-2">
            {isRegister ? 'Create Account' : (selectedRole === 'student' ? 'Student Portal' : 'Faculty Access')}
          </h2>
          <p className="text-slate-500">
            {isRegister ? `Join as a ${selectedRole}` : `Sign in to your ${selectedRole} account`}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    required={isRegister}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  defaultValue="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group",
                selectedRole === 'student' ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              )}
            >
              {loading ? (isRegister ? 'Creating...' : 'Signing in...') : (isRegister ? 'Create Account' : 'Sign In')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-4">Demo Credentials:</p>
              <div className="flex flex-col gap-2">
                {selectedRole === 'student' ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    <button onClick={() => setEmail('john.doe@student.com')} className="text-[10px] font-medium text-indigo-600 hover:underline">john.doe@student.com</button>
                    <button onClick={() => setEmail('alice@student.com')} className="text-[10px] font-medium text-indigo-600 hover:underline">alice@student.com</button>
                    <button onClick={() => setEmail('bob@student.com')} className="text-[10px] font-medium text-indigo-600 hover:underline">bob@student.com</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setEmail('sarah.smith@edu.com')}
                    className="text-xs font-medium text-emerald-600 hover:underline"
                  >
                    Faculty: sarah.smith@edu.com
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

