import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportReservationsToExcel = (reservations) => {
  const rows = reservations.map((r) => ({
    Guest: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
    Email: r.email || '',
    Phone: r.phone || '',
    Property: r.property_name || '',
    Source: r.source || '',
    Arrival: r.arrival_date || '',
    Departure: r.departure_date || '',
    Adults: r.adult_count ?? '',
    Children: r.child_count ?? '',
    Status: r.status || '',
    Total_Guest_Payment: Number(r.total_guest_payment || 0),
    Amount_Paid_To_VRBO: Number(r.amount_paid_to_vrbo || 0),
    Payout_To_Owner: Number(r.payout_to_owner || 0),
    Notes: r.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `reservations_${Date.now()}.xlsx`);
};
