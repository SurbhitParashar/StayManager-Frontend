'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const tokenExists = document.cookie.includes('token');

    if (tokenExists) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return <p>Loading...</p>;
}