'use client';

import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
    AreaChart,
} from 'recharts';

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

export default function RevenueChart({ data }) {
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
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                    margin: '0 0 4px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    letterSpacing: '-0.01em',
                }}>
                    Monthly Revenue
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#9CA3AF' }}>
                    Revenue trend over time
                </p>
            </div>

            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.15} />
                                <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis
                            dataKey="month"
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
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6C63FF', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6C63FF"
                            strokeWidth={2.5}
                            fill="url(#revenueGradient)"
                            dot={false}
                            activeDot={{ r: 5, fill: '#6C63FF', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
