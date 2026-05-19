export default function KPISection({ kpis }) {
    const cards = [
        {
            label: 'Total Revenue',
            value: `$${kpis.totalRevenue.toLocaleString()}`,
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6C63FF" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            accentColor: '#6C63FF',
            accentBg: '#F0EFFF',
        },
        {
            label: 'Total Bookings',
            value: kpis.totalBookings,
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            accentColor: '#3B82F6',
            accentBg: '#EFF6FF',
        },
        {
            label: 'Avg. Booking Value',
            value: `$${Math.round(kpis.averageBookingValue)}`,
            icon: (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            accentColor: '#10B981',
            accentBg: '#ECFDF5',
        },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
        }}>
            {cards.map((card) => (
                <div
                    key={card.label}
                    style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid #EBEBEB',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    {/* Label row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <p style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#9E9C97',
                            margin: 0,
                        }}>
                            {card.label}
                        </p>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: card.accentBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {card.icon}
                        </div>
                    </div>

                    {/* Value */}
                    <h2 style={{
                        fontSize: '34px',
                        fontWeight: '700',
                        margin: 0,
                        color: '#111827',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}>
                        {card.value}
                    </h2>

                    {/* Bottom bar */}
                    <div style={{
                        height: '3px',
                        borderRadius: '99px',
                        background: '#F3F4F6',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: '65%',
                            background: card.accentColor,
                            borderRadius: '99px',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
}