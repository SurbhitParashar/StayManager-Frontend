'use client';

import { useParams } from 'next/navigation';
import ReservationDetail from '@/components/reservations/ReservationDetail';

export default function ReservationDetailPage() {
  const params = useParams();
  return <ReservationDetail id={params.id} />;
}
