'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { INTERESTS } from '@/lib/data';

const INTEREST_ICONS: Record<string, string> = {
  nature: '🌿',
  adventure: '🧗',
  waterfalls: '💧',
  caves: '🦇',
  culture: '🏛️',
  wildlife: '🦁',
  heritage: '🏰',
  lakes: '🏞️',
};

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();

  const [name, setName]         = useState(user?.name ?? '');
  const [budget, setBudget]     = useState<'low' | 'medium' | 'high'>(user?.preferences?.budget ?? 'medium');
  const [interests, setInterests] = useState<string[]>(user?.preferences?.interests ?? []);
  const [duration, setDuration] = useState(user?.preferences?.travelDuration ?? 3);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState('');
  const [pwSaved, setPwSaved]     = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBudget(user.preferences.budget);
      setInterests(user.preferences.interests);
      setDuration(user.preferences.travelDuration);
    }
  }, [user]);

  function toggleInterest(i: string) {
    setInterests(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);

    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, preferences: { budget, interests, travelDuration: duration } }),
    });

    if (res.ok) {
      const data = await res.json();
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }

    setPwSaving(true);
    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });

    if (res.ok) {
      setPwSaved(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSaved(false), 3000);
    } else {
      const d = await res.json();
      setPwError(d.error ?? 'Failed to update password');
    }
    setPwSaving(false);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Update your details and travel preferences</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="h-16 w-16 rounded-full bg-emerald-600 flex items-center justify-center text-2xl font-bold text-white">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />

        {/* Budget */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Travel Budget</label>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as const).map(b => (
              <button key={b} type="button" onClick={() => setBudget(b)}
                className={`py-2.5 rounded-xl text-sm font-medium border capitalize transition-colors ${budget === b ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {b === 'low' ? '💚 Low' : b === 'medium' ? '💛 Medium' : '❤️ High'}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(i => (
              <button key={i} type="button" onClick={() => toggleInterest(i)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${interests.includes(i) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {INTEREST_ICONS[i] ?? '🌍'} {i}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Preferred Trip Duration: <span className="text-emerald-600 font-semibold">{duration} days</span>
          </label>
          <input type="range" min={1} max={10} value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-full accent-emerald-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 day</span><span>5 days</span><span>10 days</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="lg" loading={saving}>
            Save Changes
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium">✓ Saved successfully!</span>
          )}
        </div>
      </form>

      {/* Password change */}
      <form onSubmit={handlePasswordChange} className="space-y-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
          <p className="text-sm text-gray-400 mt-0.5">Must be at least 6 characters</p>
        </div>

        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPw}
          onChange={e => setCurrentPw(e.target.value)}
          required
        />
        <Input
          label="New Password"
          type="password"
          placeholder="At least 6 characters"
          value={newPw}
          onChange={e => setNewPw(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat new password"
          value={confirmPw}
          onChange={e => setConfirmPw(e.target.value)}
          required
        />

        {pwError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
            {pwError}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" size="lg" loading={pwSaving}>
            Update Password
          </Button>
          {pwSaved && (
            <span className="text-sm text-emerald-600 font-medium">✓ Password updated!</span>
          )}
        </div>
      </form>
    </div>
  );
}
