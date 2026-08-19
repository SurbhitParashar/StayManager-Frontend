'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getReservation } from '@/services/reservations';
import { updateAgreement, updateReview } from '@/services/workflows';

export default function ReservationDetail({ id }) {
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [agreement, setAgreement] = useState({ status: 'not_sent', sent_at: '', received_at: '', notes: '' });
  const [review, setReview] = useState({ received: false, rating: '', review_text: '', received_at: '' });

  useEffect(() => {
    getReservation(id).then((res) => {
      const data = res.data;
      setReservation(data);
      setAgreement({
        status: data.agreement?.status || 'not_sent',
        sent_at: data.agreement?.sent_at?.slice(0, 10) || '',
        received_at: data.agreement?.received_at?.slice(0, 10) || '',
        notes: data.agreement?.notes || '',
      });
      setReview({
        received: Boolean(data.review?.received),
        rating: data.review?.rating || '',
        review_text: data.review?.review_text || '',
        received_at: data.review?.received_at?.slice(0, 10) || '',
      });
    }).catch(() => alert('Failed to load reservation'));
  }, [id]);

  if (!reservation) return <div style={{ padding: 24 }}>Loading reservation...</div>;

  const nights = reservation.arrival_date && reservation.departure_date
    ? Math.max(0, Math.round((new Date(reservation.departure_date) - new Date(reservation.arrival_date)) / 86400000))
    : 0;
  const rentPerNight = nights > 0 ? Number(reservation.financials?.rent_total || 0) / nights : 0;

  const saveAgreement = async () => {
    await updateAgreement(id, agreement);
    alert('Agreement updated');
  };

  const saveReview = async () => {
    await updateReview(id, review);
    alert('Review updated');
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{reservation.first_name} {reservation.last_name}</h1>
          <p style={styles.sub}>{reservation.property_name} | {reservation.arrival_date} to {reservation.departure_date}</p>
        </div>
        <button style={styles.darkBtn} onClick={() => router.push(`/dashboard?reservationId=${id}`)}>Edit</button>
      </div>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Guest Information</h2>
        <div style={styles.grid}>
          <Metric label="Name" value={`${reservation.first_name || ''} ${reservation.last_name || ''}`.trim()} />
          <Metric label="Email" value={reservation.email || '-'} />
          <Metric label="Phone" value={reservation.phone || '-'} />
          <Metric label="Address" value={[reservation.address_line1, reservation.address_line2].filter(Boolean).join(', ') || '-'} />
          <Metric label="City / State" value={[reservation.city, reservation.state].filter(Boolean).join(', ') || '-'} />
          <Metric label="Zip / Country" value={[reservation.postal_code, reservation.country].filter(Boolean).join(', ') || '-'} />
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Reservation Details</h2>
        <div style={styles.grid}>
          <Metric label="Source" value={reservation.source || '-'} />
          <Metric label="Status" value={reservation.status || '-'} />
          <Metric label="Reservation Made" value={formatDate(reservation.reservation_made_on)} />
          <Metric label="Arrival" value={formatDate(reservation.arrival_date)} />
          <Metric label="Departure" value={formatDate(reservation.departure_date)} />
          <Metric label="No. of Nights" value={nights} />
          <Metric label="Adults" value={reservation.adult_count ?? 0} />
          <Metric label="Children" value={reservation.child_count ?? 0} />
          <Metric label="Credit Card Offline" value={reservation.credit_card_collected_offline ? 'Yes' : 'No'} />
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Financial Summary</h2>
        <div style={styles.grid}>
          <Metric label="Total Guest Payment" value={money(reservation.financials?.total_guest_payment)} />
          <Metric label="Amount Paid To VRBO" value={money(reservation.financials?.amount_paid_to_vrbo)} />
          <Metric label="Owner Payout" value={money(reservation.financials?.payout_to_owner)} />
          <Metric label="Total Rent" value={money(reservation.financials?.rent_total)} />
          <Metric label="Rent Per Night" value={money(rentPerNight)} />
          <Metric label="Cleaning Fee" value={money(reservation.financials?.cleaning_fee)} />
          <Metric label="Gate Fee" value={money(reservation.financials?.gate_fee)} />
          <Metric label="Pet Fee" value={money(reservation.financials?.pet_fee)} />
          <Metric label="Golf Cart Fee" value={money(reservation.financials?.golf_cart_fee)} />
          <Metric label="Taxes Paid By VRBO" value={money(reservation.financials?.taxes_paid_by_vrbo)} />
          <Metric label="Guest Service Fee" value={money(reservation.financials?.guest_service_fee)} />
          <Metric label="Processing Fee" value={money(reservation.financials?.payment_processing_fee)} />
          <Metric label="Discount" value={money(reservation.financials?.discount_amount)} />
          <Metric label="Adjustment" value={money(reservation.financials?.adjustment_amount)} />
          <Metric label="Subtotal Due Owner" value={money(reservation.financials?.subtotal_due_owner)} />
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Rental Agreement</h2>
        <div style={styles.formGrid}>
          <select style={styles.input} value={agreement.status} onChange={(e) => setAgreement({ ...agreement, status: e.target.value })}>
            <option value="not_sent">Not Sent</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="waived">Waived</option>
          </select>
          <input style={styles.input} type="date" value={agreement.sent_at} onChange={(e) => setAgreement({ ...agreement, sent_at: e.target.value })} />
          <input style={styles.input} type="date" value={agreement.received_at} onChange={(e) => setAgreement({ ...agreement, received_at: e.target.value })} />
          <button style={styles.darkBtn} onClick={saveAgreement}>Save</button>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Review</h2>
        <div style={styles.formGrid}>
          <label style={styles.check}><input type="checkbox" checked={review.received} onChange={(e) => setReview({ ...review, received: e.target.checked })} /> Received</label>
          <input style={styles.input} type="number" min="1" max="10" placeholder="Rating 1-10" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} />
          <input style={styles.input} type="date" value={review.received_at} onChange={(e) => setReview({ ...review, received_at: e.target.value })} />
          <button style={styles.darkBtn} onClick={saveReview}>Save</button>
        </div>
        <textarea style={{ ...styles.input, marginTop: 10, minHeight: 80 }} placeholder="Review text" value={review.review_text} onChange={(e) => setReview({ ...review, review_text: e.target.value })} />
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Payments</h2>
        {(reservation.payments || []).map((p) => (
          <div key={p.id} style={styles.payment}>
            Payment {p.payment_number || '-'} | Due {formatDate(p.due_date)} | {money(p.amount_due)} due | Paid {formatDate(p.paid_date)} | {money(p.amount_paid)} paid | {p.payment_status}
          </div>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={styles.metric}>
      <span style={styles.metricLabel}>{label}</span>
      <strong style={styles.metricValue}>{value}</strong>
    </div>
  );
}

function money(value) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  if (!value) return '-';
  return String(value).slice(0, 10);
}

const styles = {
  wrap: { padding: 20, display: 'grid', gap: 16, color: '#111827' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 24, color: '#1A1A1A' },
  sub: { margin: '4px 0 0', color: '#374151', fontWeight: 500 },
  card: { background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12, padding: 18, color: '#111827' },
  cardTitle: { margin: '0 0 12px', fontSize: 15, color: '#1A1A1A' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  metric: { display: 'grid', gap: 5, padding: 12, background: '#FAFAF8', borderRadius: 8, color: '#111827' },
  metricLabel: { color: '#374151', fontSize: 12, fontWeight: 700 },
  metricValue: { color: '#111827', fontSize: 14, fontWeight: 700 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' },
  input: {
    padding: '10px 12px',
    border: '1px solid #E4E2DC',
    borderRadius: 8,
    fontSize: 13,
    color: '#111827',
    background: '#fff',
    fontWeight: 500,
    opacity: 1,
  },
  darkBtn: { border: 0, background: '#1A1A1A', color: '#fff', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' },
  check: { fontSize: 13, color: '#111827', fontWeight: 600 },
  payment: { padding: 10, borderBottom: '1px solid #F0EEE8', fontSize: 13, color: '#111827', fontWeight: 500 },
};
