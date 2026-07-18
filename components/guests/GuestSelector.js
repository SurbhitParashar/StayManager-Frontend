'use client';

import { useEffect, useState } from 'react';
import { listGuests } from '@/services/guests';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #E4E2DC',
  borderRadius: '8px',
  fontSize: '13px',
  color: '#111827',
  background: '#FFFFFF',
  fontWeight: 500,
  lineHeight: '1.35',
  boxSizing: 'border-box',
  opacity: 1,
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#6B6860',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function GuestSelector({ value, guest, onGuestIdChange, onGuestChange }) {
  const [search, setSearch] = useState('');
  const [guests, setGuests] = useState([]);
  const [mode, setMode] = useState(value ? 'existing' : 'new');

  useEffect(() => {
    let mounted = true;

    listGuests({ search, limit: 10 })
      .then((res) => {
        if (mounted) setGuests(res.data);
      })
      .catch(() => {
        if (mounted) setGuests([]);
      });

    return () => {
      mounted = false;
    };
  }, [search]);

  const setGuestField = (field, nextValue) => {
    onGuestChange({ ...guest, [field]: nextValue });
  };

  return (
    <section style={{ display: 'grid', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" onClick={() => setMode('existing')} style={mode === 'existing' ? styles.activeTab : styles.tab}>Existing Guest</button>
        <button type="button" onClick={() => { setMode('new'); onGuestIdChange(''); }} style={mode === 'new' ? styles.activeTab : styles.tab}>New Guest</button>
      </div>

      {mode === 'existing' ? (
        <div style={{ display: 'grid', gap: '10px' }}>
          <label style={labelStyle}>Search Guest</label>
          <input style={inputStyle} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, or phone" />
          <select style={inputStyle} value={value || ''} onChange={(e) => onGuestIdChange(e.target.value)}>
            <option value="">Select guest</option>
            {guests.map((g) => (
              <option key={g.id} value={g.id}>
                {g.first_name} {g.last_name} {g.email ? `- ${g.email}` : ''}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} value={guest.first_name} onChange={(e) => setGuestField('first_name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} value={guest.last_name} onChange={(e) => setGuestField('last_name', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" value={guest.email} onChange={(e) => setGuestField('email', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={guest.phone} onChange={(e) => setGuestField('phone', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address</label>
            <input style={inputStyle} value={guest.address_line1} onChange={(e) => setGuestField('address_line1', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={guest.city} onChange={(e) => setGuestField('city', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <input style={inputStyle} value={guest.state} onChange={(e) => setGuestField('state', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Zip</label>
            <input style={inputStyle} value={guest.postal_code} onChange={(e) => setGuestField('postal_code', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input style={inputStyle} value={guest.country} onChange={(e) => setGuestField('country', e.target.value)} />
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  tab: {
    border: '1px solid #E4E2DC',
    background: '#fff',
    color: '#6B6860',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  activeTab: {
    border: '1px solid #6C63FF',
    background: '#EEF0FF',
    color: '#6C63FF',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
};
