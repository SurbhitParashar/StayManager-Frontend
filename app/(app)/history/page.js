'use client';

import BookingTable from '../../../components/BookingTable';

export default function HistoryPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{color:'black'}}>Booking History</h2>
      <BookingTable />
    </div>
  );
}