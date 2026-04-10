'use client';
import BookingForm from '@/components/BookingForm';
export const dynamic = "force-dynamic";
import { Suspense } from 'react';

export default function Dashboard() {
    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#F5F3EE',
            minHeight: '100vh',
            padding: '36px 32px',
        }}>


            {/* Page Title */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A2E', letterSpacing: '-0.02em', margin: 0 }}>
                    New Booking
                </h1>
                <p style={{ fontSize: '13px', color: '#9E9C97', margin: '4px 0 0' }}>
                    Manually create a reservation for a guest
                </p>
            </div>

            {/* Main Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
                
                <Suspense fallback={<div>Loading...</div>}>
                    <BookingForm />
                </Suspense>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Coming Soon Analytics Card */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E8E6FF',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
                            padding: '20px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', top: '-20px', right: '-20px',
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                            }} />
                            <div style={{
                                position: 'absolute', bottom: '-10px', right: '30px',
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.08)',
                            }} />
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '20px',
                                padding: '3px 10px',
                                marginBottom: '10px',
                            }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                                <span style={{ fontSize: '10px', fontWeight: '700', color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Coming Soon
                                </span>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff', letterSpacing: '-0.01em' }}>
                                Analytics Dashboard
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '4px', lineHeight: '1.5' }}>
                                Revenue trends, occupancy charts & platform breakdowns
                            </div>
                        </div>

                        <div style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#C4C2BC', marginBottom: '12px' }}>
                                Sneak peek
                            </div>
                            {[
                                { w: 82, label: 'Revenue' },
                                { w: 58, label: 'Bookings' },
                                { w: 70, label: 'Occupancy' },
                                { w: 45, label: 'Cancellations' },
                            ].map((bar, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                        <span style={{ fontSize: '11px', color: '#C4C2BC' }}>{bar.label}</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#F0EFE9', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${bar.w}%`,
                                            borderRadius: '3px',
                                            background: `linear-gradient(90deg, #A5A0FF, #6C63FF)`,
                                            opacity: 0.4 + i * 0.15,
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{
                                marginTop: '14px',
                                padding: '10px 14px',
                                background: '#F7F6FF',
                                borderRadius: '8px',
                                border: '1px dashed #C4BFFF',
                                fontSize: '12px',
                                color: '#6C63FF',
                                textAlign: 'center',
                                fontWeight: '500',
                            }}>
                                We're building something great ✦
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Integrations */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E4E2DC',
                        borderRadius: '12px',
                        padding: '18px 20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E' }}>Integrations</span>
                            <span style={{
                                fontSize: '10px', fontWeight: '700', letterSpacing: '0.07em',
                                textTransform: 'uppercase', color: '#D97706',
                                background: '#FFFBEB', border: '1px solid #FDE68A',
                                padding: '2px 8px', borderRadius: '4px',
                            }}>Soon</span>
                        </div>
                        {[
                            { name: 'Airbnb Sync', desc: 'Auto-import reservations', color: '#FF5A5F', letter: 'A' },
                            { name: 'VRBO Connect', desc: 'Real-time availability', color: '#3D5A99', letter: 'V' },
                            { name: 'Stripe Payments', desc: 'Automated collections', color: '#635BFF', letter: 'S' },
                        ].map((int, i) => (
                            <div key={int.name} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 0',
                                borderBottom: i < 2 ? '1px solid #F5F3EE' : 'none',
                                opacity: 0.55,
                            }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: int.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px', fontWeight: '700', color: '#fff',
                                    flexShrink: 0,
                                }}>{int.letter}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A2E' }}>{int.name}</div>
                                    <div style={{ fontSize: '11px', color: '#9E9C97' }}>{int.desc}</div>
                                </div>
                            </div>
                        ))}
                        <div style={{
                            marginTop: '12px',
                            fontSize: '12px', color: '#6C63FF', textAlign: 'center',
                            fontWeight: '500', cursor: 'pointer',
                        }}>
                            Notify me when ready →
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}