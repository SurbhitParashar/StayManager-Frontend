'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { name: 'Bookings', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'Reports', path: '/reports' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
     
    }}>
      {/* LOGO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="white"/>
            <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="9" y="9" width="5" height="5" rx="1" fill="white"/>
          </svg>
        </div>

        <span style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#1A1A2E'
        }}>
          StayManager
        </span>
      </div>

      {/* NAV ITEMS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {items.map(item => {
            const active = pathname === item.path;

            return (
              <span
                key={item.name}
                onClick={() => router.push(item.path)}
                style={{
                  fontSize: '13px',
                  fontWeight: active ? '600' : '400',
                  color: active ? '#6C63FF' : '#6B6860',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: active ? '#EEF0FF' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {item.name}
              </span>
            );
          })}
        </nav>

        {/* USER AVATAR */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          color: '#fff',
        }}>
          BJ
        </div>
      </div>
    </div>
  );
}