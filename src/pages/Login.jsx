import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import AuthNavbar from '../components/AuthNavbar';
import AnimatedAuthBackground from '../components/AnimatedAuthBackground';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, startDemoMode } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else if (result.requiresOtp) {
      navigate('/signup', { state: { step: 'otp', userId: result.userId, email } });
    } else {
      setError(result.error);
    }
  };

  const handleDemoClick = () => {
    startDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedAuthBackground />
      <AuthNavbar />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-10 gap-16 max-w-6xl mx-auto w-full">
        {/* Big header content */}
        <div className="max-w-md text-center lg:text-left">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-black bg-[#d4ff3f] rounded-full px-3 py-1 mb-6 shadow-[0_0_20px_rgba(212,255,63,0.35)]">
            Welcome back
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1] mb-5">
            Run your site, not your spreadsheets.
          </h1>
          <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed">
            Sign in to pick up right where your crew left off — attendance, materials, compliance and lab reports, all in one place.
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">Sign in to TerraCore</h2>
            <p className="text-black/50 dark:text-white/50 text-xs mt-1">
              Access real-time site registers, labour, and BOCW compliance reports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contractor@site.in"
                  className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-black/70 dark:text-white/70">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  required
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400 -mt-2">{error}</p>}

            <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
              <span>Sign In to Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10 dark:border-white/10" />
            </div>
            <span className="relative bg-white dark:bg-[#0a0a0a] px-3 text-[11px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
              Or Instant Access
            </span>
          </div>

          <Button variant="secondary" onClick={handleDemoClick} className="w-full py-2.5 text-xs">
            Try Demo — No Sign Up Needed
          </Button>

          <p className="text-center text-xs text-black/50 dark:text-white/50 mt-6">
            New to TerraCore?{' '}
            <Link to="/signup" className="font-semibold text-black dark:text-white hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}