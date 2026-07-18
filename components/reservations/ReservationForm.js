'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/services/api';
import { createReservation, getReservation, updateReservation } from '@/services/reservations';
import GuestSelector from '@/components/guests/GuestSelector';
import FinancialSection from './FinancialSection';
import PaymentSchedule from './PaymentSchedule';

const sourceOptions = [
  ['vrbo', 'VRBO'],
  ['airbnb', 'Airbnb'],
  ['google vacations', 'Google Vacations'],
  ['direct', 'Direct'],
  ['returning guest', 'Returning Guest'],
  ['social media', 'Social Media'],
  ['facebook', 'Facebook'],
  ['other', 'Other'],
];

const emptyGuest = {
  first_name: '',
  middle_initial: '',
  last_name: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'USA',
};

const emptyFinancials = {
  rent_total: '',
  cleaning_fee: '',
  gate_fee: '',
  pet_fee: '',
  golf_cart_fee: '',
  other_fee: '',
  discount_amount: '',
  tax_amount: '',
  guest_service_fee: '',
  payment_processing_fee: '',
  platform_fee: '',
  taxes_paid_by_vrbo: '',
  amount_paid_to_vrbo: '',
  total_guest_payment: '',
  subtotal_due_owner: '',
  payout_to_owner: '',
};

export default function ReservationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams?.get('reservationId') || searchParams?.get('id');

  const [properties, setProperties] = useState([]);
  const [saving, setSaving] = useState(false);
  const [guestId, setGuestId] = useState('');
  const [guest, setGuest] = useState(emptyGuest);
  const [reservation, setReservation] = useState({
    property_id: '',
    source: 'vrbo',
    reservation_made_on: '',
    arrival_date: '',
    departure_date: '',
    adult_count: 1,
    child_count: 0,
    status: 'booked',
    notes: '',
    credit_card_collected_offline: false,
  });
  const [financials, setFinancials] = useState(emptyFinancials);
  const [payments, setPayments] = useState([]);
  const [agreement, setAgreement] = useState({
    sent: false,
    received: false,
    sent_at: '',
    received_at: '',
  });
  const [review, setReview] = useState({
    received: false,
    rating: '',
  });

  const numberOfNights = reservation.arrival_date && reservation.departure_date
    ? Math.max(
      0,
      Math.round((new Date(`${reservation.departure_date}T00:00:00`) - new Date(`${reservation.arrival_date}T00:00:00`)) / 86400000)
    )
    : 0;

  useEffect(() => {
    API.get('/properties')
      .then((res) => setProperties(res.data))
      .catch(() => alert('Failed to load properties'));
  }, []);

  useEffect(() => {
    if (!reservationId) return;

    getReservation(reservationId)
      .then((res) => {
        const data = res.data;
        setGuestId(data.guest_id || '');
        setGuest({
          first_name: data.first_name || '',
          middle_initial: data.middle_initial || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address_line1: data.address_line1 || '',
          address_line2: data.address_line2 || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || 'USA',
        });
        setReservation({
          property_id: data.property_id || '',
          source: data.source || 'vrbo',
          reservation_made_on: data.reservation_made_on?.split('T')[0] || '',
          arrival_date: data.arrival_date?.split('T')[0] || '',
          departure_date: data.departure_date?.split('T')[0] || '',
          adult_count: data.adult_count ?? 1,
          child_count: data.child_count ?? 0,
          status: data.status || 'booked',
          notes: data.notes || '',
          credit_card_collected_offline: Boolean(data.credit_card_collected_offline),
        });
        setFinancials({ ...emptyFinancials, ...(data.financials || {}) });
        setPayments(data.payments || []);
        setAgreement({
          sent: ['sent', 'received'].includes(data.agreement?.status),
          received: data.agreement?.status === 'received',
          sent_at: data.agreement?.sent_at?.slice(0, 10) || '',
          received_at: data.agreement?.received_at?.slice(0, 10) || '',
        });
        setReview({
          received: Boolean(data.review?.received),
          rating: data.review?.rating || '',
        });
      })
      .catch(() => alert('Failed to load reservation'));
  }, [reservationId]);

  const setReservationField = (field, value) => {
    setReservation((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setSaving(true);

    try {
      const amountPaidToVrbo =
        Number(financials.taxes_paid_by_vrbo || 0) +
        Number(financials.guest_service_fee || 0) +
        Number(financials.payment_processing_fee || 0);

      const payload = {
        ...reservation,
        property_id: Number(reservation.property_id),
        adult_count: Number(reservation.adult_count || 0),
        child_count: Number(reservation.child_count || 0),
        guest_id: guestId || undefined,
        guest,
        financials: {
          ...financials,
          amount_paid_to_vrbo: amountPaidToVrbo,
        },
        payments,
        agreement,
        review,
      };

      if (reservationId) {
        await updateReservation(reservationId, payload);
        alert('Reservation updated');
      } else {
        await createReservation(payload);
        alert('Reservation created');
      }

      router.push('/history');
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{reservationId ? 'Edit Reservation' : 'New Reservation'}</h2>
          <p style={styles.subtitle}>Guest, reservation, financials, and payments</p>
        </div>
      </div>

      <div style={styles.body}>
        <Block title="Guest">
          <GuestSelector
            value={guestId}
            guest={guest}
            onGuestIdChange={setGuestId}
            onGuestChange={setGuest}
          />
        </Block>

        <Block title="Reservation">
          <div style={styles.grid}>
            <Field label="Property">
              <select style={styles.input} value={reservation.property_id} onChange={(e) => setReservationField('property_id', e.target.value)}>
                <option value="">Select property</option>
                {properties.map((property) => (
                  <option key={property.property_id} value={property.property_id}>{property.property_name}</option>
                ))}
              </select>
            </Field>
            <Field label="Source">
              <select style={styles.input} value={reservation.source} onChange={(e) => setReservationField('source', e.target.value)}>
                {sourceOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Reservation Made">
              <input style={styles.input} type="date" value={reservation.reservation_made_on} onChange={(e) => setReservationField('reservation_made_on', e.target.value)} />
            </Field>
            <Field label="Arrival">
              <input style={styles.input} type="date" value={reservation.arrival_date} onChange={(e) => setReservationField('arrival_date', e.target.value)} />
            </Field>
            <Field label="Departure">
              <input style={styles.input} type="date" value={reservation.departure_date} onChange={(e) => setReservationField('departure_date', e.target.value)} />
            </Field>
            <Field label="Adults">
              <input style={styles.input} type="number" min="0" value={reservation.adult_count} onChange={(e) => setReservationField('adult_count', e.target.value)} />
            </Field>
            <Field label="Children">
              <input style={styles.input} type="number" min="0" value={reservation.child_count} onChange={(e) => setReservationField('child_count', e.target.value)} />
            </Field>
            <Field label="Status">
              <select style={styles.input} value={reservation.status} onChange={(e) => setReservationField('status', e.target.value)}>
                <option value="inquiry">Inquiry</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={reservation.credit_card_collected_offline}
                onChange={(e) => setReservationField('credit_card_collected_offline', e.target.checked)}
              />
              Credit card collected offline
            </label>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Notes">
                <textarea style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }} value={reservation.notes} onChange={(e) => setReservationField('notes', e.target.value)} />
              </Field>
            </div>
          </div>
        </Block>

        <Block title="Financials">
          <FinancialSection value={financials} onChange={setFinancials} numberOfNights={numberOfNights} />
        </Block>

        <Block title="Payments">
          <PaymentSchedule
            payments={payments}
            onChange={setPayments}
            arrivalDate={reservation.arrival_date}
            totalAmount={financials.total_guest_payment}
            isDirectRental={reservation.source === 'direct'}
          />
        </Block>

        <Block title="Direct Rental, Agreement & Review">
          <div style={styles.grid}>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={agreement.sent}
                onChange={(e) => setAgreement({ ...agreement, sent: e.target.checked, received: e.target.checked ? agreement.received : false })}
              />
              Rental agreement sent
            </label>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={agreement.received}
                onChange={(e) => setAgreement({ ...agreement, received: e.target.checked, sent: e.target.checked ? true : agreement.sent })}
              />
              Rental agreement received
            </label>
            <Field label="Agreement Sent Date">
              <input style={styles.input} type="date" value={agreement.sent_at} onChange={(e) => setAgreement({ ...agreement, sent_at: e.target.value })} />
            </Field>
            <Field label="Agreement Received Date">
              <input style={styles.input} type="date" value={agreement.received_at} onChange={(e) => setAgreement({ ...agreement, received_at: e.target.value })} />
            </Field>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={review.received}
                onChange={(e) => setReview({ ...review, received: e.target.checked, rating: e.target.checked ? review.rating : '' })}
              />
              Review received
            </label>
            <Field label="Review Rating">
              <select style={styles.input} value={review.rating} disabled={!review.received} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                <option value="">Select rating</option>
                {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </Field>
          </div>
        </Block>

        <div style={styles.actions}>
          <button type="button" style={styles.secondaryBtn} onClick={() => router.push('/history')}>Cancel</button>
          <button type="button" style={styles.primaryBtn} onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save Reservation'}</button>
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <section style={styles.block}>
      <h3 style={styles.blockTitle}>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: '5px' }}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #E4E2DC',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #F0EEE8',
    background: '#FAFAF8',
  },
  title: { margin: 0, color: '#1A1A1A', fontSize: '18px' },
  subtitle: { margin: '4px 0 0', color: '#9E9C97', fontSize: '13px' },
  body: { padding: '22px 24px', display: 'grid', gap: '22px' },
  block: { display: 'grid', gap: '14px' },
  blockTitle: {
    margin: 0,
    color: '#1A1A1A',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  input: {
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
  },
  label: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6B6860',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  checkbox: {
    alignSelf: 'end',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    color: '#3D3C38',
    fontSize: '13px',
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  primaryBtn: {
    border: 'none',
    background: '#1A1A1A',
    color: '#fff',
    borderRadius: '8px',
    padding: '11px 18px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    border: '1px solid #E4E2DC',
    background: '#fff',
    color: '#6B6860',
    borderRadius: '8px',
    padding: '11px 18px',
    cursor: 'pointer',
  },
};
