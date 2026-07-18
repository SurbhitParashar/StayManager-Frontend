'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReservation, listReservations } from '@/services/reservations';
import { exportReservationsToExcel } from './exportReservations';

const sourceLabels = {
  vrbo: 'VRBO',
  airbnb: 'Airbnb',
  direct: 'Direct',
  'google vacations': 'Google',
  'returning guest': 'Returning',
  'social media': 'Social',
  facebook: 'Facebook',
  other: 'Other',
};

export default function ReservationTable() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [filters, setFilters] = useState({ search: '', source: '', status: '', start_date: '', end_date: '' });
  const [loading, setLoading] = useState(true);

  const fetchReservations = (nextFilters = filters) => {
    setLoading(true);
    listReservations({ ...nextFilters, limit: 100 })
      .then((res) => setReservations(res.data))
      .catch(() => alert('Failed to load reservations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let mounted = true;

    listReservations({ limit: 100 })
      .then((res) => {
        if (mounted) setReservations(res.data);
      })
      .catch(() => {
        if (mounted) alert('Failed to load reservations');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => fetchReservations(filters);

  const remove = async (id) => {
    if (!confirm('Delete this reservation?')) return;
    await deleteReservation(id);
    setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Reservation History</h2>
          <p style={styles.subtitle}>{reservations.length} result{reservations.length === 1 ? '' : 's'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={styles.secondaryBtn} onClick={() => exportReservationsToExcel(reservations)}>Export Excel</button>
          <button style={styles.primaryBtn} onClick={() => router.push('/dashboard')}>New Reservation</button>
        </div>
      </div>

      <div style={styles.filters}>
        <input style={styles.input} placeholder="Search guest" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} />
        <select style={styles.input} value={filters.source} onChange={(e) => setFilter('source', e.target.value)}>
          <option value="">All sources</option>
          {Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select style={styles.input} value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="inquiry">Inquiry</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input style={styles.input} type="date" value={filters.start_date} onChange={(e) => setFilter('start_date', e.target.value)} />
        <input style={styles.input} type="date" value={filters.end_date} onChange={(e) => setFilter('end_date', e.target.value)} />
        <button style={styles.secondaryBtn} onClick={applyFilters}>Apply</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Guest</th>
              <th style={styles.th}>Property</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Dates</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={styles.empty} colSpan="8">Loading reservations...</td></tr>
            ) : reservations.length === 0 ? (
              <tr><td style={styles.empty} colSpan="8">No reservations found.</td></tr>
            ) : reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td style={styles.td}>{reservation.first_name} {reservation.last_name}</td>
                <td style={styles.td}>{reservation.property_name}</td>
                <td style={styles.td}>{sourceLabels[reservation.source] || reservation.source}</td>
                <td style={styles.td}>{reservation.arrival_date} to {reservation.departure_date}</td>
                <td style={styles.td}>${Number(reservation.total_guest_payment || 0).toLocaleString()}</td>
                <td style={styles.td}>{reservation.status}</td>
                <td style={styles.td}><span style={styles.notes}>{reservation.notes || 'No notes'}</span></td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <button style={styles.smallBtn} onClick={() => router.push(`/dashboard?reservationId=${reservation.id}`)}>Edit</button>
                  <button style={styles.smallBtn} onClick={() => router.push(`/reservations/${reservation.id}`)}>View</button>
                  <button style={{ ...styles.smallBtn, ...styles.dangerBtn }} onClick={() => remove(reservation.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #E4E2DC',
    borderRadius: '14px',
    overflow: 'hidden',
    marginTop: '20px',
  },
  header: {
    padding: '18px 22px',
    borderBottom: '1px solid #E4E2DC',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  title: { margin: 0, fontSize: '18px', color: '#1A1A1A' },
  subtitle: { margin: '4px 0 0', fontSize: '13px', color: '#9E9C97' },
  filters: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
    gap: '10px',
    padding: '14px 22px',
    borderBottom: '1px solid #E4E2DC',
    background: '#FAFAF8',
  },
  input: {
    padding: '9px 10px',
    border: '1px solid #E4E2DC',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#111827',
    background: '#FFFFFF',
    fontWeight: 500,
    lineHeight: '1.35',
    opacity: 1,
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '11px',
    color: '#9E9C97',
    textTransform: 'uppercase',
    background: '#FAFAF8',
    borderBottom: '1px solid #E4E2DC',
  },
  td: { padding: '13px 16px', borderBottom: '1px solid #F0EEE8', fontSize: '13px', color: '#1A1A1A' },
  empty: { padding: '40px', textAlign: 'center', color: '#9E9C97' },
  notes: { display: 'block', maxWidth: '240px', overflowWrap: 'anywhere', color: '#6B6860' },
  primaryBtn: { border: 'none', background: '#1A1A1A', color: '#fff', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer' },
  secondaryBtn: { border: '1px solid #E4E2DC', background: '#fff', color: '#6B6860', borderRadius: '8px', padding: '9px 12px', cursor: 'pointer' },
  smallBtn: { margin: '0 3px', border: '1px solid #C8D9F8', background: '#EEF4FF', color: '#1A56DB', borderRadius: '7px', padding: '7px 9px', cursor: 'pointer' },
  dangerBtn: { borderColor: '#F4C0BC', background: '#FFF0F0', color: '#C5221F' },
};
