'use client';
import { useEffect, useState } from 'react';
import API from '@/services/api';
import { bookingSchema } from '@/validations/bookingSchema';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';



const baseInput = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '13px',
  color: '#1A1A2E',
  background: '#FAFAF8',
  border: '1.5px solid #E8E6F0',
  borderRadius: '8px',
  padding: '10px 12px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
};

const baseSelect = {
  ...baseInput,
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236C63FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '32px',
  cursor: 'pointer',
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#8B87A8',
  marginBottom: '5px',
  display: 'block',
};

const formGroupStyle = { display: 'flex', flexDirection: 'column' };

const SECTIONS = [
  {
    key: 'guest',
    label: 'Guest Information',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <circle cx="6.5" cy="4.5" r="2.5" stroke="#6C63FF" strokeWidth="1.3" />
        <path d="M1.5 11.5C1.5 9.567 3.767 8 6.5 8C9.233 8 11.5 9.567 11.5 11.5" stroke="#6C63FF" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    color: '#6C63FF',
    bg: '#EEF0FF',
  },
  {
    key: 'booking',
    label: 'Booking Details',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1.5" y="3" width="10" height="9" rx="1.5" stroke="#0EA5E9" strokeWidth="1.3" />
        <path d="M4.5 2V4M8.5 2V4" stroke="#0EA5E9" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M1.5 6H11.5" stroke="#0EA5E9" strokeWidth="1.3" />
      </svg>
    ),
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    key: 'payment',
    label: 'Payment',
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <rect x="1.5" y="3.5" width="10" height="7" rx="1.5" stroke="#10B981" strokeWidth="1.3" />
        <path d="M1.5 6.5H11.5" stroke="#10B981" strokeWidth="1.3" />
        <circle cx="4.5" cy="8.5" r="0.8" fill="#10B981" />
      </svg>
    ),
    color: '#10B981',
    bg: '#D1FAE5',
  },
];

export default function BookingForm() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const router = useRouter();


  const [properties, setProperties] = useState([]);
  const [focused, setFocused] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    property_id: '', platform: 'vrbo',
    start_date: '', end_date: '',
    total_amount: '', payment_mode: 'online transaction', status: 'booked',
  });

  // if moving from history for edit 
  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await API.get(`/booking/${bookingId}`);
        const data = res.data;

        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          property_id: data.property_id || '',
          platform: data.platform || 'vrbo',
          start_date: data.start_date?.split('T')[0],
          end_date: data.end_date?.split('T')[0],
          total_amount: data.total_amount || '',
          payment_mode: data.payment_mode || 'online transaction',
          status: data.status || 'booked'
        });

      } catch (err) {
        console.error(err);
        alert('Failed to load booking');
      }
    };

    fetchBooking();

  }, [bookingId]);


  useEffect(() => {
    API.get('/properties')
      .then(res => setProperties(res.data))
      .catch(() => alert('Failed to load properties'));
  }, []);

  const handleReset = () => setForm({
    name: '', email: '', phone: '',
    property_id: '', platform: 'vrbo',
    start_date: '', end_date: '',
    total_amount: '', payment_mode: 'online transaction', status: 'booked',
  });

  const handleSubmit = async () => {

    try {
      const validatedData = bookingSchema.parse({
        ...form,
        property_id: Number(form.property_id),
        total_amount: Number(form.total_amount)
      });

      if (bookingId) {
        //UPDATE MODE
        await API.put(`/booking/${bookingId}`, validatedData);
        alert('Booking updated ');
        router.push('/history');
        
      } else {
        // CREATE MODE
        await API.post('/booking', validatedData);
        alert('Booking created ');
        
      }

    } catch (err) {
      alert(err.errors?.[0]?.message || error);
    }
  };

  const inputStyle = (field) => ({
    ...baseInput,
    borderColor: focused === field ? '#6C63FF' : '#E8E6F0',
    background: focused === field ? '#FAFAFF' : '#FAFAF8',
    boxShadow: focused === field ? '0 0 0 3px rgba(108,99,255,0.1)' : 'none',
  });

  const selectStyle = (field) => ({
    ...baseSelect,
    borderColor: focused === field ? '#6C63FF' : '#E8E6F0',
    background: focused === field ? '#FAFAFF' : '#FAFAF8',
    boxShadow: focused === field ? '0 0 0 3px rgba(108,99,255,0.1)' : 'none',
  });

  const bind = (field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
  });

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ECEAF5',
      borderRadius: '14px',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: '0 1px 4px rgba(108,99,255,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #F0EFF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #FAFAFF 0%, #F8F7FF 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(108,99,255,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2.5" y="4.5" width="13" height="11" rx="2" stroke="white" strokeWidth="1.4" />
              <path d="M6 4.5V3C6 2.17 6.67 1.5 7.5 1.5H10.5C11.33 1.5 12 2.17 12 3V4.5" stroke="white" strokeWidth="1.4" />
              <path d="M6 9H12M6 12H9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em', color: '#1A1A2E' }}>
              New Booking
            </div>
            <div style={{ fontSize: '12px', color: '#9B97B8', marginTop: '2px' }}>
              Fill in the details to create a reservation
            </div>
          </div>
        </div>
        <span style={{
          background: '#EEF0FF',
          color: '#6C63FF',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #C4BFFF',
        }}>Manual Entry</span>
      </div>

      {/* Body */}
      <div style={{ padding: '26px 24px' }}>

        {/* ── SECTION: Guest Information ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: SECTIONS[0].bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{SECTIONS[0].icon}</div>
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: SECTIONS[0].color }}>
            {SECTIONS[0].label}
          </span>
          <div style={{ flex: 1, height: '1px', background: '#F0EFF8' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: '24px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle('name')} placeholder="John Smith"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} {...bind('name')} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle('phone')} placeholder="+1 (555) 000-0000"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} {...bind('phone')} />
          </div>
          <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle('email')} type="email" placeholder="guest@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} {...bind('email')} />
          </div>
        </div>

        {/* ── SECTION: Booking Details ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: SECTIONS[1].bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{SECTIONS[1].icon}</div>
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: SECTIONS[1].color }}>
            {SECTIONS[1].label}
          </span>
          <div style={{ flex: 1, height: '1px', background: '#F0EFF8' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: '24px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Property</label>
            <select style={selectStyle('property')} value={form.property_id}
              onChange={e => setForm({ ...form, property_id: e.target.value })} {...bind('property')}>
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.property_id} value={p.property_id}>{p.property_name}</option>
              ))}
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Platform</label>
            <select style={selectStyle('platform')} value={form.platform}
              onChange={e => setForm({ ...form, platform: e.target.value })} {...bind('platform')}>
              <option value="vrbo">VRBO</option>
              <option value="airbnb">Airbnb</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Check-in</label>
            <input style={inputStyle('checkin')} type="date" value={form.start_date}
              onChange={e => setForm({ ...form, start_date: e.target.value })} {...bind('checkin')} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Check-out</label>
            <input style={inputStyle('checkout')} type="date" value={form.end_date}
              onChange={e => setForm({ ...form, end_date: e.target.value })} {...bind('checkout')} />
          </div>
        </div>

        {/* ── SECTION: Payment ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: SECTIONS[2].bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>{SECTIONS[2].icon}</div>
          <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: SECTIONS[2].color }}>
            {SECTIONS[2].label}
          </span>
          <div style={{ flex: 1, height: '1px', background: '#F0EFF8' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Total Amount ($)</label>
            <input style={inputStyle('amount')} type="number" placeholder="0.00"
              value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} {...bind('amount')} />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Payment Method</label>
            <select style={selectStyle('payment')} value={form.payment_mode}
              onChange={e => setForm({ ...form, payment_mode: e.target.value })} {...bind('payment')}>
              <option value="online transaction">Online Transaction</option>
              <option value="cash transaction">Cash Transaction</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select style={selectStyle('status')} value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })} {...bind('status')}>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #F0EFF8',
        }}>
          <button
            onClick={handleReset}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px', fontWeight: '500',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              background: 'transparent',
              border: '1.5px solid #E8E6F0',
              color: '#8B87A8',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.background = '#F7F6FF'; e.target.style.borderColor = '#C4BFFF'; e.target.style.color = '#6C63FF'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#E8E6F0'; e.target.style.color = '#8B87A8'; }}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px', fontWeight: '600',
              padding: '10px 22px', borderRadius: '8px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
              border: 'none',
              color: '#fff',
              transition: 'opacity 0.15s, transform 0.1s',
              display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: '0 2px 8px rgba(108,99,255,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            
              {bookingId ? 'Edit Booking' : 'Create Booking'}
            
          </button>
        </div>
      </div>
    </div>
  );
}