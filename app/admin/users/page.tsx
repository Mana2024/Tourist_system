'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';

interface UserPreferences {
  budget: 'low' | 'medium' | 'high';
  interests: string[];
  travelDuration: number;
}

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  preferences: UserPreferences;
  createdAt: string;
}

const INTEREST_ICONS: Record<string, string> = {
  nature: '🌿', adventure: '🧗', waterfalls: '💧', caves: '🦇',
  culture: '🏛️', wildlife: '🦁', heritage: '🏰', lakes: '🏞️',
};

const BUDGET_BADGE: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

function PasswordModal({
  user,
  token,
  onClose,
}: {
  user: AppUser;
  token: string;
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setError('');
    setSaving(true);

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: user._id, password }),
    });

    if (res.ok) {
      setSuccess(true);
      setTimeout(onClose, 1200);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed');
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.name} · {user.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">✅</p>
            <p className="font-medium text-gray-800">Password updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                minLength={6}
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="submit" size="lg" loading={saving} className="flex-1">
                Update Password
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pwUser, setPwUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/users?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.filter(u => u._id !== id));
    setDeleting(null);
  }

  const filtered = users.filter(u =>
    search === '' ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  return (
    <>
      {pwUser && token && (
        <PasswordModal user={pwUser} token={token} onClose={() => setPwUser(null)} />
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
          <p className="text-gray-500 mt-1">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm mt-1">Users appear here once they register on the portal</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(u => (
              <div key={u._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">

                {/* Avatar + name */}
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                    {u.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium capitalize">
                      {u.role}
                    </span>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Budget</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${BUDGET_BADGE[u.preferences.budget]}`}>
                      {u.preferences.budget === 'low' ? '💚' : u.preferences.budget === 'medium' ? '💛' : '❤️'} {u.preferences.budget}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">Trip Duration</span>
                    <span className="text-xs font-medium text-gray-700">
                      ✈️ {u.preferences.travelDuration} day{u.preferences.travelDuration !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide mt-0.5 flex-shrink-0">Interests</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {u.preferences.interests.length > 0
                        ? u.preferences.interests.map(i => (
                          <span key={i} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                            {INTEREST_ICONS[i] ?? '🌍'} {i}
                          </span>
                        ))
                        : <span className="text-xs text-gray-400">None set</span>
                      }
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Joined {formatDate(u.createdAt)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPwUser(u)}
                      className="text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      🔑 Password
                    </button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deleting === u._id}
                      onClick={() => handleDelete(u._id, u.name)}
                      className="text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
