'use client';

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

const COLORS = ['#6C63FF', '#3B82F6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#111827',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                    {payload[0].name}
                </p>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                    {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function PlatformPieChart({ data }) {
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #EBEBEB',
            borderRadius: '16px',
            padding: '24px',
            height: '340px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                    margin: '0 0 4px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    letterSpacing: '-0.01em',
                }}>
                    Platform Distribution
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                    Bookings by platform
                </p>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: '0 0 160px', height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={48}
                                outerRadius={76}
                                paddingAngle={3}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    {data.map((entry, index) => (
                        <div key={entry.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: COLORS[index % COLORS.length],
                                    flexShrink: 0,
                                }} />
                                <span style={{
                                    fontSize: '12px',
                                    color: '#6B7280',
                                    fontWeight: '500',
                                }}>
                                    {entry.name}
                                </span>
                            </div>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#111827',
                            }}>
                                {entry.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}