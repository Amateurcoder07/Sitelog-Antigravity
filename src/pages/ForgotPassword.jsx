import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import AuthNavbar from '../components/AuthNavbar';
import AnimatedAuthBackground from '../components/AnimatedAuthBackground';
import { Mail, Briefcase, Lock, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const roles = [
    t('roles.contractor'), t('roles.labour'), t('roles.engineer'),
    t('roles.skilledTrades'), t('roles.constructionCompany'),
  ];

  const [step, setStep] = useState('request'); // 'request' | 'otp' | 'reset'
  const [accountType, setAccountType] = useState(roles[0]);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [resendStatus, setResendStatus] = useState(''); // '' | 'sending' | 'sent'

  const { forgotPassword, resetPassword, resendOtp } = useAuth();
  const navigate = useNavigate();

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await forgotPassword(email, accountType);
    if (result.success) {
      setUserId(result.userId);
      setStep('otp');
    } else {
      setError(result.error);
    }
  };

  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) {
      document.getElementById(`fp-otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`fp-otp-${idx - 1}`)?.focus();
    }
  };

  // OTP correctness is confirmed on the backend as part of resetPassword,
  // so this step just moves the user forward to set a new password.
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (otp.join('').length !== 6) {
      setError('Enter the full 6-digit code.');
      return;
    }
    setStep('reset');
  };

  const handleResend = async () => {
    setResendStatus('sending');
    setError('');
    const result = await resendOtp(userId);
    if (result.success) {
      setOtp(['', '', '', '', '', '']);
      document.getElementById('fp-otp-0')?.focus();
      setResendStatus('sent');
      setTimeout(() => setResendStatus(''), 3000);
    } else {
      setError(result.error);
      setResendStatus('');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(t('forgotPassword.mismatch'));
      return;
    }
    setError('');
    const code = otp.join('');
    const result = await resetPassword(userId, code, newPassword);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      // If the code itself was wrong/expired, send them back to re-enter it
      setStep('otp');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedAuthBackground />
      <AuthNavbar />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 py-10 gap-16 max-w-6xl mx-auto w-full">
        {/* Big header content */}
        <div className="max-w-md text-center lg:text-left">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-black bg-[#d4ff3f] rounded-full px-3 py-1 mb-6 shadow-[0_0_20px_rgba(212,255,63,0.35)]">
            {step === 'request' && t('forgotPassword.badgeRequest')}
            {step === 'otp' && t('forgotPassword.badgeOtp')}
            {step === 'reset' && t('forgotPassword.badgeReset')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1] mb-5">
            {step === 'request' && t('forgotPassword.titleRequest')}
            {step === 'otp' && t('forgotPassword.titleOtp')}
            {step === 'reset' && t('forgotPassword.titleReset')}
          </h1>
          <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed">
            {step === 'request' && t('forgotPassword.subtitleRequest')}
            {step === 'otp' && t('signup.subtitleOtp')}
            {step === 'reset' && t('forgotPassword.subtitleReset')}
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border-2 border-black/15 dark:border-white/15 rounded-2xl p-8 shadow-2xl">
          {/* Step 1 — Request */}
          {step === 'request' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{t('forgotPassword.heading')}</h2>
                <p className="text-black/50 dark:text-white/50 text-xs mt-1">{t('forgotPassword.subheading')}</p>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('forgotPassword.accountType')}</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                    >
                      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('forgotPassword.email')}</label>
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

                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

                <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
                  <span>{t('forgotPassword.submit')}</span>
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="text-center text-xs text-black/50 dark:text-white/50 mt-6">
                {t('forgotPassword.backToLogin')}{' '}
                <Link to="/login" className="font-semibold text-black dark:text-white hover:underline">
                  {t('signup.signIn')}
                </Link>
              </p>
            </>
          )}

          {/* Step 2 — OTP */}
          {step === 'otp' && (
            <>
              <button
                type="button"
                onClick={() => { setStep('request'); setError(''); }}
                className="flex items-center gap-1.5 text-xs font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft size={14} />
                {t('forgotPassword.back')}
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{t('forgotPassword.otpHeading')}</h2>
                <p className="text-black/50 dark:text-white/50 text-xs mt-1">
                  {t('signup.verifySub', { email: email || t('forgotPassword.email') })}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`fp-otp-${idx}`}
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
                  <span>{t('forgotPassword.verify')}</span>
                  <ArrowRight size={16} />
                </Button>
              </form>

              <p className="text-center text-xs text-black/50 dark:text-white/50 mt-6">
                {t('forgotPassword.noCode')}{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="font-semibold text-black dark:text-white hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {resendStatus === 'sent' ? t('forgotPassword.resend') + ' ✓' : t('forgotPassword.resend')}
                </button>
              </p>
            </>
          )}

          {/* Step 3 — Reset */}
          {step === 'reset' && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0">
                  <KeyRound size={16} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white tracking-tight">{t('forgotPassword.resetHeading')}</h2>
                  <p className="text-black/50 dark:text-white/50 text-xs mt-0.5">{t('forgotPassword.resetSub')}</p>
                </div>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('forgotPassword.newPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 dark:text-white/70 mb-1.5">{t('forgotPassword.confirmPassword')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 text-black/40 dark:text-white/40" size={16} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-black border border-black/15 dark:border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

                <Button variant="primary" type="submit" className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
                  <span>{t('forgotPassword.resetSubmit')}</span>
                  <ArrowRight size={16} />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}