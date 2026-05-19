'use client';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from 'recharts';

const COLORS = ['#6C63FF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#111827',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>{label}</p>
                <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function PropertyPerformanceChart({ data }) {
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #EBEBEB',
            borderRadius: '16px',
            padding: '24px',
            height: '340px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                    margin: '0 0 4px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    letterSpacing: '-0.01em',
                }}>
                    Property Performance
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                    Revenue by property
                </p>
            </div>

            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis
                            dataKey="property"
                            tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.05)' }} />
                        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    fillOpacity={0.9}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}