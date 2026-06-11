'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Phone, ArrowRight, Shield, Loader as Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

type Step = 'phone' | 'otp' | 'success';

export default function LoginPage() {
  const { signInWithPhone, verifyOtp, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (user) router.push('/profile');
  }, [user, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOtp = async () => {
    setError('');
    const formatted = phone.startsWith('+91') ? phone : `+91${phone}`;
    if (formatted.length < 13) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    const { error: err } = await signInWithPhone(formatted);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const token = otp.join('');
    if (token.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    const formatted = phone.startsWith('+91') ? phone : `+91${phone}`;
    const { error: err } = await verifyOtp(formatted, token);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setStep('success');
      setTimeout(() => router.push('/profile'), 1200);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => !d);
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-forest-600 flex items-center justify-center mx-auto mb-4 shadow-eco">
            <Leaf className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-forest-900">
            {step === 'success' ? 'Welcome to KarmaCloset!' : 'Login to KarmaCloset'}
          </h1>
          <p className="text-sm text-forest-600 mt-1">
            {step === 'phone' && 'Enter your mobile number to get started'}
            {step === 'otp' && 'We sent a 6-digit code to your phone'}
            {step === 'success' && 'Redirecting to your profile...'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-sage-100 shadow-card p-6 sm:p-8">
          {/* Step: Phone */}
          {step === 'phone' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-forest-800 mb-2">Mobile Number</label>
                <div className="flex items-center border border-sage-200 rounded-xl focus-within:border-forest-400 focus-within:ring-2 focus-within:ring-forest-100 transition-all overflow-hidden">
                  <div className="px-3 py-3 bg-sage-50 border-r border-sage-200 text-sm font-semibold text-forest-700 select-none">
                    +91
                  </div>
                  <div className="px-2 py-3 text-forest-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-2 py-3 text-sm text-forest-800 bg-transparent outline-none placeholder:text-forest-300"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <Button
                onClick={handleSendOtp}
                disabled={loading || phone.length < 10}
                className="w-full bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Send OTP <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sage-200" /></div>
                <span className="relative bg-white px-3 text-xs text-forest-400 font-medium">or continue with</span>
              </div>

              <Button
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    const { error: googleError } = await signInWithGoogle();
                    if (googleError) {
                      setError(googleError.message || 'Google sign-in failed');
                    }
                  } catch (err: any) {
                    setError(err.message || 'An unexpected error occurred');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                variant="outline"
                className="w-full border-sage-200 text-forest-700 hover:bg-sage-50 py-3 h-auto rounded-xl font-semibold"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>

              <div className="flex items-start gap-2 pt-2">
                <Shield className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                <p className="text-xs text-forest-400 leading-relaxed">
                  Your number is used only for verification. We never share your data. OTP login is secure and password-free.
                </p>
              </div>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="space-y-5 animate-fade-in">
              <button
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="flex items-center gap-1 text-sm text-forest-600 hover:text-forest-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div>
                <label className="block text-sm font-medium text-forest-800 mb-3">Enter OTP</label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all',
                        digit
                          ? 'border-forest-400 bg-forest-50 text-forest-800'
                          : 'border-sage-200 text-forest-800 focus:border-forest-400 focus:ring-2 focus:ring-forest-100'
                      )}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className="w-full bg-forest-600 hover:bg-forest-700 text-white py-3 h-auto rounded-xl font-semibold shadow-eco"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Login'}
              </Button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-forest-400">Resend OTP in <span className="font-semibold text-forest-600">{countdown}s</span></p>
                ) : (
                  <button
                    onClick={handleSendOtp}
                    className="text-xs font-semibold text-forest-600 hover:text-forest-800 transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <p className="text-xs text-forest-400 text-center">
                OTP sent to +91 {phone}
              </p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-forest-600" />
              </div>
              <p className="text-forest-700 font-medium">You&apos;re in! Welcome to the KarmaCloset community.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-forest-400 text-center mt-6">
          By continuing, you agree to KarmaCloset&apos;s{' '}
          <span className="underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
