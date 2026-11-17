'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import { useAuth } from '@/components/AuthProvider';

const roles = ['viewer', 'manager', 'admin'];
const emptyForm = { email: '', password: '', role: 'viewer' };

export default function UsersPage() {
  const { can, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const allowed = can('users.manage');

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    API.get('/users').then(({ data }) => { if (active) setUsers(data); })
      .catch(() => { if (active) setMessage('Unable to load users.'); });
    return () => { active = false; };
  }, [allowed]);

  async function create(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const { data } = await API.post('/users', form);
      setUsers(previous => [...previous, data]);
      setForm(emptyForm);
      setMessage('User created. Share their password securely.');
    } catch (err) { setMessage(err.response?.data?.message || 'Unable to create user.'); }
    finally { setBusy(false); }
  }

  async function save(account) {
    setBusy(true);
    setMessage('');
    try {
      await API.patch(`/users/${account.user_id}/access`, { role: account.role, is_active: account.is_active });
      if (String(account.user_id) === String(user.user_id)) {
        window.location.assign('/login');
        return;
      }
      setMessage('Access updated. The user must sign in again.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update access.');
      const { data } = await API.get('/users');
      setUsers(data);
    } finally { setBusy(false); }
  }

  function edit(id, patch) {
    setUsers(previous => previous.map(account => account.user_id === id ? { ...account, ...patch } : account));
  }

  if (!allowed) return <p>Administrator access required.</p>;
  return <main style={{ maxWidth: 1000, margin: '32px auto', color: '#111827' }}>
    <h1>User access</h1>
    <p>Admins manage accounts and delete records. Managers create and edit records. Viewers can read records and reports.</p>
    <p>Changing access ends the account’s existing sessions. At least one active admin is required.</p>
    {message && <p role="status">{message}</p>}
    <section style={card}>
      <h2>Create user</h2>
      <form onSubmit={create} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label>Email <input required type="email" autoComplete="off" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Temporary password <input required type="password" minLength={12} maxLength={72} autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <label>Role <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{roles.map(role => <option key={role}>{role}</option>)}</select></label>
        <button disabled={busy}>Create user</button>
      </form>
    </section>
    <section style={{ ...card, overflowX: 'auto' }}>
      <h2>Accounts</h2>
      <table style={{ width: '100%', textAlign: 'left' }}>
        <thead><tr><th>Email</th><th>Role</th><th>Active</th><th>Action</th></tr></thead>
        <tbody>{users.map(account => <tr key={account.user_id}>
          <td style={{ padding: '12px 0' }}>{account.email}{String(account.user_id) === String(user.user_id) ? ' (you)' : ''}</td>
          <td><select aria-label={`Role for ${account.email}`} disabled={busy} value={account.role} onChange={e => edit(account.user_id, { role: e.target.value })}>{roles.map(role => <option key={role}>{role}</option>)}</select></td>
          <td><input aria-label={`Active account for ${account.email}`} disabled={busy} type="checkbox" checked={account.is_active} onChange={e => edit(account.user_id, { is_active: e.target.checked })} /></td>
          <td><button disabled={busy} onClick={() => save(account)}>Save access</button></td>
        </tr>)}</tbody>
      </table>
    </section>
  </main>;
}

const card = { padding: 24, marginTop: 20, background: 'white', border: '1px solid #E4E2DC', borderRadius: 12 };
