import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Lock, Mail, ArrowRight, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, startDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email || 'tanmay@sitelog.in', password);
    navigate('/dashboard');
  };

  const handleDemoClick = () => {
    startDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#040711] bg-grid-pattern flex flex-col justify-center items-center px-6 py-12">
      {/* Radiant Glow */}
      <div className="hero-glow"></div>

      <div className="w-full max-w-md bg-[#090e1a] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="w-10 h-10 bg-[#ea580c] rounded-xl flex items-center justify-center shadow-lg mb-3 hover:scale-105 transition-transform">
            <Building2 size={22} className="text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to SiteLog</h1>
          <p className="text-slate-400 text-xs mt-1">
            Access real-time site registers, labour, and BOCW compliance reports.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contractor Email or Phone
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contractor@site.in"
                className="w-full bg-[#040711] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ea580c] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#040711] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ea580c] transition-colors"
                required
              />
            </div>
          </div>

          <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
            <span>Sign In to Dashboard</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative bg-[#090e1a] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Or Instant Access
          </span>
        </div>

        {/* Demo Mode Action */}
        <Button
          variant="secondary"
          onClick={handleDemoClick}
          className="w-full py-2.5 text-xs text-[#ea580c] border-[#ea580c]/60"
        >
          Try Demo — No Sign Up Needed
        </Button>
      </div>
    </div>
  );
}
