'use client';

import { Suspense } from 'react';
import ReservationForm from '@/components/reservations/ReservationForm';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#F5F3EE',
            minHeight: '100vh',
            padding: '36px 32px',
        }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A2E', margin: 0 }}>
                    Reservations
                </h1>
                <p style={{ fontSize: '13px', color: '#9E9C97', margin: '4px 0 0' }}>
                    Create and manage guest reservations
                </p>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ReservationForm />
            </Suspense>
        </div>
    );
}
