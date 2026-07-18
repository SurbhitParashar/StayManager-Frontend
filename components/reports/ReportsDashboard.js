'use client';

import { useEffect, useState } from 'react';

import KPISection from './KPISection';
import RevenueChart from './RevenueChart';
import PlatformPieChart from './PlatformPieChart';
import PropertyPerformanceChart from './PropertyPerformanceChart';

import {
    getPropertyPerformanceReport,
    getReportKpis,
    getRevenueReport,
    getSourceBreakdownReport,
} from '@/services/reports';

export default function ReportsDashboard() {
    const [kpis, setKpis] = useState({
        totalRevenue: 0,
        totalBookings: 0,
        averageBookingValue: 0,
    });
    const [revenue, setRevenue] = useState([]);
    const [sourceBreakdown, setSourceBreakdown] = useState([]);
    const [propertyPerformance, setPropertyPerformance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [kpiRes, revenueRes, sourceRes, propertyRes] = await Promise.all([
                getReportKpis(),
                getRevenueReport(),
                getSourceBreakdownReport(),
                getPropertyPerformanceReport(),
            ]);

            setKpis({
                totalRevenue: Number(kpiRes.data.total_revenue || 0),
                totalBookings: Number(kpiRes.data.total_reservations || 0),
                averageBookingValue: Number(kpiRes.data.average_reservation_value || 0),
            });

            setRevenue(revenueRes.data.map((row) => ({
                month: row.month,
                revenue: Number(row.revenue || 0),
            })));

            const totalSources = sourceRes.data.reduce((sum, row) => sum + Number(row.reservations || 0), 0);
            setSourceBreakdown(sourceRes.data.map((row) => ({
                name: row.source,
                value: totalSources > 0 ? Math.round((Number(row.reservations || 0) / totalSources) * 100) : 0,
            })));

            setPropertyPerformance(propertyRes.data.map((row) => ({
                property: row.property_name,
                revenue: Number(row.revenue || 0),
            })));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                    Overview of reservation performance
                </p>
            </div>

            <KPISection kpis={kpis} />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
            }}>
                <RevenueChart data={revenue} />
                <PlatformPieChart data={sourceBreakdown} />
            </div>

            <PropertyPerformanceChart data={propertyPerformance} />
        </div>
    );
}
