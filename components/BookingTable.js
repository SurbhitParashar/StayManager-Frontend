'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';


export default function BookingTable() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const res = await API.get('/booking');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to load bookings');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;

        try {
            await API.delete(`/booking/${id}`);
            setBookings(prev => prev.filter(b => b.booking_id !== id));
            alert('Booking deleted successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to delete booking');
        }
    };

    // Helper to style status
    const getStatusStyle = (status) => {
        const styles = {
            booked: { background: '#E6F4EA', color: '#137333', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' },
            cancelled: { background: '#FCE8E6', color: '#C5221F', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' },
        };
        return styles[status] || { background: '#F1F1F1', color: '#555', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px' };
    };

    return (
        <div style={{
            background: '#fff',
            border: '1px solid #E4E2DC',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            marginTop: '20px'
        }}>
            {/* Table Header */}
            <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E4E2DC',
                background: '#FAFAF8'
            }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    margin: 0
                }}>
                    All Bookings
                </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    color: '#1A1A1A'
                }}>
                    <thead>
                        <tr style={{ background: '#FAFAF8', borderBottom: '2px solid #E4E2DC' }}>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guest Name</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Property</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dates</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '600', color: '#6B6860', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9E9C97' }}>
                                    No bookings found yet.
                                </td>
                            </tr>
                        ) : (
                            bookings.map(b => (
                                <tr key={b.booking_id} style={{
                                    borderBottom: '1px solid #E4E2DC',
                                    transition: 'background 0.15s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '16px 20px' }}>{b.name}</td>
                                    <td style={{ padding: '16px 20px' }}>{b.property_name}</td>
                                    <td style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '13px' }}>{b.platform}</td>
                                    <td style={{ padding: '16px 20px', color: '#6B6860' }}>
                                        {b.start_date} → {b.end_date}
                                    </td>
                                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>
                                        ${Number(b.total_amount).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={getStatusStyle(b.status)}>
                                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>

                                        {/* EDIT BUTTON */}
                                        <button
                                            onClick={() => router.push(`/dashboard?id=${b.booking_id}`)}
                                            style={{
                                                marginRight: '10px',
                                                color: '#3B82F6',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {/* DELETE BUTTON */}
                                        <button
                                            onClick={() => handleDelete(b.booking_id)}
                                            style={{
                                                color: '#C5221F',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}