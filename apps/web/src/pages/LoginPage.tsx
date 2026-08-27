import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Smartphone } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const savedUserStr = localStorage.getItem('fieldloop_user');
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.role === 'TECHNICIAN') {
          navigate('/tech-portal');
          return;
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 bg-[#FFFDF2] relative overflow-hidden font-sans text-[#0F0F0F]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-5"><Logo size="lg" darkText={true} /></Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0F0F0F]">Sign in to Fieldloop</h2>
          <p className="mt-2 text-xs font-bold text-[#333333]">Access your organization workspace</p>
        </div>
        <div className="p-6 sm:p-8 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F] shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg flex items-center gap-2.5 text-xs bg-[#FEF2F2] border-2 border-[#DC2626] text-[#DC2626] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label-ui text-[10px] block mb-1.5 text-[#0F0F0F] font-extrabold">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0F0F0F]"><Mail className="w-4 h-4" /></div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@apexplumbing.com" className="input-field pl-9 pr-3 py-3 border-2 border-[#0F0F0F] text-xs font-bold text-[#0F0F0F] bg-[#FFFDF2]" />
              </div>
            </div>
            <div>
              <label className="label-ui text-[10px] block mb-1.5 text-[#0F0F0F] font-extrabold">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0F0F0F]"><Lock className="w-4 h-4" /></div>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-9 pr-3 py-3 border-2 border-[#0F0F0F] text-xs font-bold text-[#0F0F0F] bg-[#FFFDF2]" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-amber w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 mt-2 bg-[#0F0F0F] text-[#FFFDF2] border-2 border-[#0F0F0F]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#FFFDF2]" /> : <>Sign in <ArrowRight className="w-4 h-4 text-[#FFFDF2]" /></>}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t-2 border-[#0F0F0F] flex items-center justify-between text-xs text-[#0F0F0F] font-bold">
            <Link to="/tech-login" className="font-extrabold text-[#0F0F0F] hover:underline flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Technician Login
            </Link>
            <Link to="/register" className="font-extrabold text-[#0F0F0F] hover:underline">Start free trial</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
