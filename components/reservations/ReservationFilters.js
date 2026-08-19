'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

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

export const emptyReservationFilters = {
  search: '',
  property_id: '',
  source: '',
  status: '',
  start_date: '',
  end_date: '',
  month: '',
};

const dayMs = 24 * 60 * 60 * 1000;

const getSelectedDays = (startDate, endDate) => {
  if (!startDate || !endDate) return null;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }

  return Math.floor((end - start) / dayMs) + 1;
};

export const cleanReservationFilters = (filters) => (
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '')
  )
);

export default function ReservationFilters({
  filters,
  onFilterChange,
  onApply,
  onClear,
  showStatus = true,
}) {
  const [properties, setProperties] = useState([]);
  const selectedDays = getSelectedDays(filters.start_date, filters.end_date);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  useEffect(() => {
    API.get('/properties')
      .then((res) => setProperties(res.data || []))
      .catch(() => setProperties([]));
  }, []);

  const setFilter = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div style={styles.filters}>
      <input
        style={styles.input}
        placeholder="Search guest"
        value={filters.search}
        onChange={(e) => setFilter('search', e.target.value)}
      />
      <select
        style={styles.input}
        value={filters.property_id}
        onChange={(e) => setFilter('property_id', e.target.value)}
      >
        <option value="">All properties</option>
        {properties.map((property) => (
          <option key={property.property_id} value={property.property_id}>{property.property_name}</option>
        ))}
      </select>
      <select style={styles.input} value={filters.source} onChange={(e) => setFilter('source', e.target.value)}>
        <option value="">All sources</option>
        {Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      {showStatus && (
        <select style={styles.input} value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="inquiry">Inquiry</option>
          <option value="booked">Booked</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      )}
      <input
        style={styles.input}
        type="month"
        value={filters.month}
        onChange={(e) => setFilter('month', e.target.value)}
      />
      <input
        style={styles.input}
        type="date"
        value={filters.start_date}
        onChange={(e) => setFilter('start_date', e.target.value)}
      />
      <input
        style={styles.input}
        type="date"
        value={filters.end_date}
        onChange={(e) => setFilter('end_date', e.target.value)}
      />
      {selectedDays && (
        <span style={styles.dayCount}>{selectedDays} day{selectedDays === 1 ? '' : 's'}</span>
      )}
      <button style={styles.secondaryBtn} onClick={onApply}>Apply</button>
      {hasActiveFilters && (
        <button style={styles.secondaryBtn} onClick={onClear}>Clear</button>
      )}
    </div>
  );
}

const styles = {
  filters: {
    display: 'grid',
    gridTemplateColumns: 'minmax(150px, 2fr) minmax(150px, 2fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) auto auto',
    gap: '10px',
    padding: '14px 22px',
    borderBottom: '1px solid #E4E2DC',
    background: '#FAFAF8',
    alignItems: 'center',
    overflowX: 'auto',
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
    minWidth: 0,
  },
  dayCount: {
    color: '#111827',
    fontSize: '13px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  secondaryBtn: {
    border: '1px solid #E4E2DC',
    background: '#fff',
    color: '#111827',
    borderRadius: '8px',
    padding: '9px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
};
