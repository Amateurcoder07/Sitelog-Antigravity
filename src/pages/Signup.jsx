import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import AuthNavbar from '../components/AuthNavbar';
import AnimatedAuthBackground from '../components/AnimatedAuthBackground';
import { User, Mail, Lock, Phone, Briefcase, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Signup() {
  const { t } = useTranslation();
  const roles = [
    t('roles.contractor'), t('roles.labour'), t('roles.engineer'),
    t('roles.skilledTrades'), t('roles.constructionCompany'),
  ];

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [form, setForm] = useState({
    name: '', role: roles[0], specialization: '',
    email: '', password: '', phone: '',
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // '' | 'sending' | 'sent'

  const { register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
      specialization: form.role === roles[2] ? form.specialization : undefined,
    });

    if (result.success) {
      setUserId(result.userId);
      setStep('otp');
    } else {
      setError(result.error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    const result = await verifyOtp(userId, code);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleResend = async () => {
    setResendStatus('sending');
    setError('');
    const result = await resendOtp(userId);
    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
      setResendStatus('sent');
      setTimeout(() => setResendStatus(''), 3000);
    } else {
      setError(result.error);
      setResendStatus('');
    }
  };

  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedAuthBackground />
      <AuthNavbar />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-10 gap-16 max-w-6xl mx-auto w-full">
        <div className="max-w-md text-center lg:text-left">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-black bg-[#d4ff3f] rounded-full px-3 py-1 mb-6 shadow-[0_0_20px_rgba(212,255,63,0.35)]">
            {step === 'form' ? t('signup.badgeForm') : t('signup.badgeOtp')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1] mb-5">
            {step === 'form' ? t('signup.titleForm') : t('signup.titleOtp')}
          </h1>
          <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed">
            {step === 'form' ? t('signup.subtitleForm') : t('signup.subtitleOtp')}
          </p>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-8 shadow-2xl">
          {step === 'form' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{t('signup.heading')}</h2>
                <p className="text-black/50 dark:text-white/50 text-xs mt-1">{t('signup.subheading')}</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('signup.fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="text" value={form.name} onChange={update('name')}
                      placeholder="e.g. Tanmay Deshmukh"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('signup.role')}</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <select
                      value={form.role} onChange={update('role')}
                      className="w-full appearance-none bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    >
                      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                {form.role === roles[2] && (
                  <div>
                    <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">Specialization</label>
                    <input
                      type="text" value={form.specialization} onChange={update('specialization')}
                      placeholder="e.g. Structural Engineer"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg px-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('signup.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="email" value={form.email} onChange={update('email')}
                      placeholder="e.g. contractor@site.in"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('signup.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="tel" value={form.phone} onChange={update('phone')}
                      placeholder="e.g. 98765 43210"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('signup.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="password" value={form.password} onChange={update('password')}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

                <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
                  <span>{t('signup.register')}</span>
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="text-center text-xs text-black/50 dark:text-white/50 mt-6">
                {t('signup.haveAccount')}{' '}
                <Link to="/login" className="font-semibold text-black dark:text-white hover:underline">
                  {t('signup.signIn')}
                </Link>
              </p>
            </>
          )}

          {step === 'otp' && (
            <>
              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); }}
                className="flex items-center gap-1.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft size={14} />
                {t('signup.backToDetails')}
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{t('signup.verifyHeading')}</h2>
                <p className="text-black/50 dark:text-white/50 text-xs mt-1">
                  {t('signup.verifySub', { email: form.email || t('signup.email') })}
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="otp-input bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  ))}
                </div>

                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

                <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
                  <span>{t('signup.verify')}</span>
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="text-center text-xs text-black/50 dark:text-white/50 mt-6">
                {t('signup.noCode')}{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="font-semibold text-black dark:text-white hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {resendStatus === 'sent' ? t('signup.resend') + ' ✓' : t('signup.resend')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}