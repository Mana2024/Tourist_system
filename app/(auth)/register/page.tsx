'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const INTERESTS = ['nature', 'adventure', 'waterfalls', 'caves', 'culture'];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    budget: 'medium' as 'low' | 'medium' | 'high',
    interests: ['nature'] as string[],
    travelDuration: 3,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleInterest(interest: string) {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.interests.length === 0) {
      setError('Select at least one interest.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          preferences: {
            budget: form.budget,
            interests: form.interests,
            travelDuration: form.travelDuration,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Registration failed');
        return;
      }

      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm">
          ← Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 mt-2">Tell us your preferences and we&apos;ll recommend the best places</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Input
          label="Full name"
          placeholder="John Doe"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          minLength={6}
          required
        />

        {/* Budget */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as const).map(b => (
              <button
                key={b}
                type="button"
                onClick={() => setForm(f => ({ ...f, budget: b }))}
                className={`py-2 rounded-lg text-sm font-medium border capitalize transition-colors ${
                  form.budget === b
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {b === 'low' ? '💚 Low' : b === 'medium' ? '💛 Medium' : '❤️ High'}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Interests (pick all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                  form.interests.includes(i)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {i === 'nature' ? '🌿' : i === 'adventure' ? '🧗' : i === 'waterfalls' ? '💧' : i === 'caves' ? '🦇' : '🏛️'} {i}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Travel duration: <span className="text-emerald-600 font-semibold">{form.travelDuration} days</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.travelDuration}
            onChange={e => setForm(f => ({ ...f, travelDuration: Number(e.target.value) }))}
            className="w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 day</span><span>5 days</span><span>10 days</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create Account & Explore
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
