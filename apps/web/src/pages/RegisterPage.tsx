import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [orgName, setOrgName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(orgName, name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  const fields = [
    { label: 'Organization Name', icon: Building2, value: orgName, set: setOrgName, type: 'text', placeholder: 'Apex Plumbing Solutions' },
    { label: 'Your Full Name', icon: User, value: name, set: setName, type: 'text', placeholder: 'John Doe' },
    { label: 'Work Email Address', icon: Mail, value: email, set: setEmail, type: 'email', placeholder: 'john@apexplumbing.com' },
    { label: 'Password', icon: Lock, value: password, set: setPassword, type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 bg-[#FFFDF2] relative overflow-hidden font-sans text-[#0F0F0F]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-5"><Logo size="lg" darkText={true} /></Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0F0F0F]">Create your Organization</h2>
          <p className="mt-2 text-xs font-bold text-[#333333]">14-day free trial. No credit card required.</p>
        </div>
        <div className="p-6 sm:p-8 rounded-xl bg-[#FFFDF2] border-2 border-[#0F0F0F] shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg flex items-center gap-2.5 text-xs bg-[#FEF2F2] border-2 border-[#DC2626] text-[#DC2626] font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map(({ label, icon: Icon, value, set, type, placeholder }) => (
              <div key={label}>
                <label className="label-ui text-[10px] block mb-1.5 text-[#0F0F0F] font-extrabold">{label}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#0F0F0F]"><Icon className="w-4 h-4" /></div>
                  <input type={type} required value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className="input-field pl-9 pr-3 py-2.5 border-2 border-[#0F0F0F] text-xs font-bold text-[#0F0F0F] bg-[#FFFDF2]" />
                </div>
              </div>
            ))}
            <button type="submit" disabled={isLoading} className="btn-amber w-full py-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 mt-2 bg-[#0F0F0F] text-[#FFFDF2] border-2 border-[#0F0F0F]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#FFFDF2]" /> : <>Register Organization <ArrowRight className="w-4 h-4 text-[#FFFDF2]" /></>}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t-2 border-[#0F0F0F] text-center text-xs text-[#0F0F0F] font-bold">
            Already registered? <Link to="/login" className="font-extrabold text-[#0F0F0F] hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
