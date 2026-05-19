'use client';

import { useEffect, useState } from 'react';
import API from '@/services/api';

import KPISection from './KPISection';
import RevenueChart from './RevenueChart';
import PlatformPieChart from './PlatformPieChart';
import PropertyPerformanceChart from './PropertyPerformanceChart';

import {
    calculateKPIs,
    monthlyRevenueData,
    platformDistributionData,
    propertyRevenueData,
} from './analytics/bookingAnalytics';

export default function ReportsDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await API.get('/booking');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const kpis = calculateKPIs(bookings);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '320px',
                color: '#9CA3AF',
                fontSize: '14px',
            }}>
                Loading dashboard...
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '24px',
            background: '#F9F9F8',
            minHeight: '100vh',
        }}>

            {/* Header */}
            <div style={{ marginBottom: '4px' }}>
                <h1 style={{
                    margin: '0 0 4px',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.02em',
                }}>
                    Reports & Analytics
                </h1>
                <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#9CA3AF',
                }}>
                    Overview of your booking performance
                </p>
            </div>

            {/* KPIs */}
            <KPISection kpis={kpis} />

            {/* Charts — top row: Revenue (wider) + Pie */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
            }}>
                <RevenueChart data={monthlyRevenueData(bookings)} />
                <PlatformPieChart data={platformDistributionData(bookings)} />
            </div>

            {/* Charts — bottom row: Property Performance full width */}
            <PropertyPerformanceChart data={propertyRevenueData(bookings)} />

        </div>
    );
}