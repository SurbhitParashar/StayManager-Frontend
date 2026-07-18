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
    if (value) setMode('existing');
  }, [value]);

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
          <select
            style={inputStyle}
            value={value || ''}
            onChange={(e) => {
              const selectedId = e.target.value;
              onGuestIdChange(selectedId);
              const selectedGuest = guests.find((g) => g.id === selectedId);
              if (selectedGuest) {
                onGuestChange({
                  first_name: selectedGuest.first_name || '',
                  middle_initial: selectedGuest.middle_initial || '',
                  last_name: selectedGuest.last_name || '',
                  email: selectedGuest.email || '',
                  phone: selectedGuest.phone || '',
                  address_line1: selectedGuest.address_line1 || '',
                  address_line2: selectedGuest.address_line2 || '',
                  city: selectedGuest.city || '',
                  state: selectedGuest.state || '',
                  postal_code: selectedGuest.postal_code || '',
                  country: selectedGuest.country || 'USA',
                });
              }
            }}
          >
            <option value="">Select guest</option>
            {value && guest?.first_name && !guests.some((g) => g.id === value) && (
              <option value={value}>{guest.first_name} {guest.last_name} {guest.email ? `- ${guest.email}` : ''}</option>
            )}
            {guests.map((g) => (
              <option key={g.id} value={g.id}>
                {g.first_name} {g.last_name} {g.email ? `- ${g.email}` : ''}
              </option>
            ))}
          </select>
          {value && (
            <GuestFields guest={guest} setGuestField={setGuestField} />
          )}
        </div>
      ) : (
        <GuestFields guest={guest} setGuestField={setGuestField} />
      )}
    </section>
  );
}

function GuestFields({ guest, setGuestField }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <Field label="First Name"><input style={inputStyle} value={guest.first_name || ''} onChange={(e) => setGuestField('first_name', e.target.value)} /></Field>
      <Field label="Last Name"><input style={inputStyle} value={guest.last_name || ''} onChange={(e) => setGuestField('last_name', e.target.value)} /></Field>
      <Field label="Email"><input style={inputStyle} type="email" value={guest.email || ''} onChange={(e) => setGuestField('email', e.target.value)} /></Field>
      <Field label="Phone"><input style={inputStyle} value={guest.phone || ''} onChange={(e) => setGuestField('phone', e.target.value)} /></Field>
      <div style={{ gridColumn: '1 / -1' }}><Field label="Address"><input style={inputStyle} value={guest.address_line1 || ''} onChange={(e) => setGuestField('address_line1', e.target.value)} /></Field></div>
      <Field label="Apt / Address 2"><input style={inputStyle} value={guest.address_line2 || ''} onChange={(e) => setGuestField('address_line2', e.target.value)} /></Field>
      <Field label="City"><input style={inputStyle} value={guest.city || ''} onChange={(e) => setGuestField('city', e.target.value)} /></Field>
      <Field label="State"><input style={inputStyle} value={guest.state || ''} onChange={(e) => setGuestField('state', e.target.value)} /></Field>
      <Field label="Zip"><input style={inputStyle} value={guest.postal_code || ''} onChange={(e) => setGuestField('postal_code', e.target.value)} /></Field>
      <Field label="Country"><input style={inputStyle} value={guest.country || ''} onChange={(e) => setGuestField('country', e.target.value)} /></Field>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
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
