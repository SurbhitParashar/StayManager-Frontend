'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';
import BookingFilters from './booking/BookingFilters';
import useBookingFilters from './booking/useBookingFilters';
import { exportToExcel } from './booking/export/exportToExcel';
import { exportToPDF } from './booking/export/exportToPDF';


const PlatformBadge = ({ platform }) => {
    const colors = {
        airbnb:  { bg: '#FFF0F0', color: '#E00B41' },
        vrbo:    { bg: '#EEF4FF', color: '#1A56DB' },
        booking: { bg: '#E8F5E9', color: '#2E7D32' },
        direct:  { bg: '#F3F0FF', color: '#6D28D9' },
    };
    const s = colors[platform?.toLowerCase()] || { bg: '#F3F3F3', color: '#555' };

    return (
        <span style={{ ...styles.badge, ...styles.platformBadge, background: s.bg, color: s.color }}>
            <span style={{ ...styles.badgeDot, background: s.color }} />
            {platform}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const map = {
        booked:    { bg: '#E6F4EA', color: '#137333', border: '#B7DFC0' },
        cancelled: { bg: '#FCE8E6', color: '#C5221F', border: '#F4C0BC' },
    };
    const s = map[status] || { bg: '#F1F1F1', color: '#555', border: '#DDD' };

    return (
        <span style={{ ...styles.badge, ...styles.statusBadge, background: s.bg, color: s.color, borderColor: s.border }}>
            <span style={{ ...styles.badgeDot, background: s.color }} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};


export default function BookingTable() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const { filters, setFilters, filteredBookings } = useBookingFilters(bookings);

    const properties = [...new Set(bookings.map(b => b.property_name))];
    const platforms  = [...new Set(bookings.map(b => b.platform))];

    const fetchBookings = async () => {
        try {
            const res = await API.get('/booking');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to load bookings');
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        try {
            await API.delete(`/booking/${id}`);
            setBookings(prev => prev.filter(b => b.booking_id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete booking');
        }
    };

    const showingLabel = filteredBookings.length !== bookings.length
        ? `Showing ${filteredBookings.length} of ${bookings.length} bookings`
        : `${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'} total`;

    const totalRevenue = filteredBookings
        .reduce((sum, b) => sum + Number(b.total_amount), 0)
        .toLocaleString();

    return (
        <div style={styles.card}>

            {/* Header */}
            <div style={styles.cardHeader}>
                <div>
                    <h2 style={styles.cardTitle}>All Bookings</h2>
                    <p style={styles.cardSubtitle}>{showingLabel}</p>
                </div>

                <div style={styles.headerActions}>
                    <button style={{ ...styles.btn, ...styles.btnGreen }} onClick={() => exportToExcel(filteredBookings)}>
                        Export Excel
                    </button>
                    <button style={{ ...styles.btn, ...styles.btnRed }} onClick={() => exportToPDF(filteredBookings)}>
                        Export PDF
                    </button>
                    <button style={{ ...styles.btn, ...styles.btnDark }} onClick={() => router.push('/dashboard')}>
                        + New Booking
                    </button>
                </div>
            </div>

            {/* Filters */}
            <BookingFilters
                filters={filters}
                setFilters={setFilters}
                properties={properties}
                platforms={platforms}
            />

            {/* Table */}
            <div style={styles.tableScroll}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Guest Name</th>
                            <th style={styles.th}>Property</th>
                            <th style={styles.th}>Platform</th>
                            <th style={styles.th}>Dates</th>
                            <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                            <th style={styles.th}>Status</th>
                            <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.emptyCell}>
                                    <div style={styles.emptyState}>
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <rect x="6" y="8" width="28" height="26" rx="3" stroke="#D1CFC8" strokeWidth="1.5" />
                                            <path d="M13 4v8M27 4v8M6 18h28" stroke="#D1CFC8" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span style={styles.emptyText}>No bookings found yet.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.emptyCell}>
                                    <div style={styles.emptyState}>
                                        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                                            <circle cx="17" cy="17" r="11" stroke="#D1CFC8" strokeWidth="1.5" />
                                            <path d="M26 26l7 7" stroke="#D1CFC8" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M12 17h10M17 12v10" stroke="#D1CFC8" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span style={styles.emptyText}>No bookings match your filters.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((b) => {
                                const hue = (b.name?.charCodeAt(0) || 0) * 17 % 360;
                                return (
                                    <tr
                                        key={b.booking_id}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {/* Guest */}
                                        <td style={styles.td}>
                                            <div style={styles.guestCell}>
                                                <div style={{ ...styles.avatar, background: `hsl(${hue}, 55%, 90%)`, color: `hsl(${hue}, 55%, 35%)` }}>
                                                    {b.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={styles.guestName}>{b.name}</span>
                                            </div>
                                        </td>

                                        {/* Property */}
                                        <td style={styles.td}>
                                            <span style={styles.propertyName}>{b.property_name}</span>
                                        </td>

                                        {/* Platform */}
                                        <td style={styles.td}>
                                            <PlatformBadge platform={b.platform} />
                                        </td>

                                        {/* Dates */}
                                        <td style={styles.td}>
                                            <div style={styles.dateRange}>
                                                <span style={styles.dateChip}>{b.start_date}</span>
                                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path d="M0 4h12M9 1l3 3-3 3" stroke="#C8C6BF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span style={styles.dateChip}>{b.end_date}</span>
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td style={{ ...styles.td, textAlign: 'right' }}>
                                            <span style={styles.amount}>${Number(b.total_amount).toLocaleString()}</span>
                                        </td>

                                        {/* Status */}
                                        <td style={styles.td}>
                                            <StatusBadge status={b.status} />
                                        </td>

                                        {/* Actions */}
                                        <td style={{ ...styles.td, textAlign: 'center' }}>
                                            <div style={styles.actionGroup}>
                                                <button
                                                    style={{ ...styles.btnSm, ...styles.btnBlue }}
                                                    onClick={() => router.push(`/dashboard?id=${b.booking_id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{ ...styles.btnSm, ...styles.btnRed }}
                                                    onClick={() => handleDelete(b.booking_id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            {filteredBookings.length > 0 && (
                <div style={styles.cardFooter}>
                    <span style={styles.footerMeta}>
                        Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'result' : 'results'}
                    </span>
                    <span style={styles.footerMeta}>
                        Total revenue: <strong style={styles.footerTotal}>${totalRevenue}</strong>
                    </span>
                </div>
            )}
        </div>
    );
}


/* ─── Styles ─────────────────────────────────────────────── */

const styles = {
    // Card
    card: {
        background: '#fff',
        border: '1px solid #E4E2DC',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        marginTop: '20px',
        fontFamily: "'DM Sans', sans-serif",
    },

    // Header
    cardHeader: {
        padding: '20px 24px',
        borderBottom: '1px solid #E4E2DC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
    },
    cardTitle: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#1A1A1A',
        margin: 0,
    },
    cardSubtitle: {
        margin: '2px 0 0',
        fontSize: '12.5px',
        color: '#9E9C97',
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
    },

    // Buttons
    btn: {
        height: '36px',
        padding: '0 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid transparent',
        whiteSpace: 'nowrap',
    },
    btnSm: {
        height: '32px',
        padding: '0 14px',
        borderRadius: '7px',
        fontSize: '12.5px',
        fontWeight: '600',
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid transparent',
    },
    btnDark:  { background: '#1A1A1A', color: '#fff',     borderColor: '#1A1A1A' },
    btnGreen: { background: '#E8F5E9', color: '#2E7D32',  borderColor: '#C8E6C9' },
    btnRed:   { background: '#FFF0F0', color: '#C5221F',  borderColor: '#F4C0BC' },
    btnBlue:  { background: '#EEF4FF', color: '#1A56DB',  borderColor: '#C8D9F8' },

    // Table
    tableScroll: { overflowX: 'auto' },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'DM Sans', sans-serif",
    },
    th: {
        padding: '13px 20px',
        textAlign: 'left',
        fontWeight: '600',
        color: '#9E9C97',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.7px',
        whiteSpace: 'nowrap',
        background: '#FAFAF8',
        borderBottom: '2px solid #E4E2DC',
    },
    td: {
        padding: '15px 20px',
        fontSize: '14px',
        color: '#1A1A1A',
        borderBottom: '1px solid #F0EEE8',
        verticalAlign: 'middle',
    },

    // Guest
    guestCell:    { display: 'flex', alignItems: 'center', gap: '10px' },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        flexShrink: 0,
    },
    guestName:    { fontWeight: '500' },
    propertyName: { fontWeight: '500', color: '#3D3C38' },

    // Dates
    dateRange: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' },
    dateChip: {
        background: '#F5F4F0',
        padding: '3px 9px',
        borderRadius: '5px',
        fontWeight: '500',
        color: '#3D3C38',
        whiteSpace: 'nowrap',
    },

    // Amount
    amount: { fontWeight: '700', fontSize: '15px', color: '#1A1A1A', letterSpacing: '-0.3px' },

    // Actions
    actionGroup: { display: 'flex', justifyContent: 'center', gap: '6px' },

    // Badges
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: '600',
    },
    badgeDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        flexShrink: 0,
    },
    platformBadge: {
        padding: '3px 10px',
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12.5px',
        border: '1px solid transparent',
    },

    // Empty state
    emptyCell:  { padding: '60px 20px', textAlign: 'center' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    emptyText:  { fontSize: '14px', color: '#9E9C97', fontWeight: '500' },

    // Footer
    cardFooter: {
        padding: '14px 24px',
        borderTop: '1px solid #F0EEE8',
        background: '#FAFAF8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
    },
    footerMeta:  { fontSize: '12.5px', color: '#9E9C97' },
    footerTotal: { color: '#1A1A1A', fontWeight: '700' },
};