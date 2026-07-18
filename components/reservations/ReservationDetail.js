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
        <h2 style={styles.cardTitle}>Financial Summary</h2>
        <div style={styles.grid}>
          <Metric label="Total Guest Payment" value={`$${Number(reservation.financials?.total_guest_payment || 0).toLocaleString()}`} />
          <Metric label="Owner Payout" value={`$${Number(reservation.financials?.payout_to_owner || 0).toLocaleString()}`} />
          <Metric label="Status" value={reservation.status} />
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
          <div key={p.id} style={styles.payment}>{p.payment_status} | Due ${Number(p.amount_due || 0).toLocaleString()} | Paid ${Number(p.amount_paid || 0).toLocaleString()}</div>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return <div style={styles.metric}><span>{label}</span><strong>{value}</strong></div>;
}

const styles = {
  wrap: { padding: 20, display: 'grid', gap: 16 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 24, color: '#1A1A1A' },
  sub: { margin: '4px 0 0', color: '#6B6860' },
  card: { background: '#fff', border: '1px solid #E4E2DC', borderRadius: 12, padding: 18 },
  cardTitle: { margin: '0 0 12px', fontSize: 15, color: '#1A1A1A' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  metric: { display: 'grid', gap: 5, padding: 12, background: '#FAFAF8', borderRadius: 8 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' },
  input: { padding: '10px 12px', border: '1px solid #E4E2DC', borderRadius: 8, fontSize: 13 },
  darkBtn: { border: 0, background: '#1A1A1A', color: '#fff', borderRadius: 8, padding: '10px 14px', cursor: 'pointer' },
  check: { fontSize: 13, color: '#3D3C38' },
  payment: { padding: 10, borderBottom: '1px solid #F0EEE8', fontSize: 13 },
};
