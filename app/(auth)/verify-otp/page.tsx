'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';

function VerifyOTPContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.replace('/register');
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleChange(idx: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      inputs.current[5]?.focus();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Verification failed');
        return;
      }
      login(data.token, data.user);
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMsg('');
    setError('');
    setResending(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not resend OTP');
      } else {
        setResendMsg('A new OTP has been sent to your email.');
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-3xl font-bold text-gray-900">Check your email</h1>
        <p className="text-gray-500 mt-2">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-gray-700">{email}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3 text-center">
            Enter OTP
          </label>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-colors
                  border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Code expires in 10 minutes
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {resendMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
            {resendMsg}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Verify & Continue
        </Button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              Resend code in <span className="font-medium text-gray-600">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-emerald-600 font-medium hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Wrong email?{' '}
        <a href="/register" className="text-emerald-600 font-medium hover:underline">
          Go back
        </a>
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}