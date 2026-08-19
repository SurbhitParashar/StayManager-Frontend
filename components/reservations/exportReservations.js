import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const asMoney = (value) => Number(value || 0);
const asDate = (value) => value ? String(value).slice(0, 10) : '';
const asYesNo = (value) => value ? 'Yes' : 'No';

const formatPayment = (payment) => ([
  payment.payment_number ? `#${payment.payment_number}` : '',
  payment.due_date ? `Due: ${asDate(payment.due_date)}` : '',
  `Amount Due: ${asMoney(payment.amount_due)}`,
  payment.paid_date ? `Paid: ${asDate(payment.paid_date)}` : '',
  `Amount Paid: ${asMoney(payment.amount_paid)}`,
  payment.payment_method ? `Method: ${payment.payment_method}` : '',
  payment.payment_status ? `Status: ${payment.payment_status}` : '',
  payment.notes ? `Notes: ${payment.notes}` : '',
].filter(Boolean).join(' | '));

export const exportReservationsToExcel = (reservations) => {
  const maxPayments = reservations.reduce((max, reservation) => (
    Math.max(max, Array.isArray(reservation.payments) ? reservation.payments.length : 0)
  ), 0);

  const rows = reservations.map((r) => ({
    Reservation_ID: r.id || '',
    Legacy_Booking_ID: r.legacy_booking_id || '',
    Guest_ID: r.guest_id || '',
    First_Name: r.first_name || '',
    Middle_Initial: r.middle_initial || '',
    Last_Name: r.last_name || '',
    Guest: `${r.first_name || ''} ${r.middle_initial || ''} ${r.last_name || ''}`.replace(/\s+/g, ' ').trim(),
    Email: r.email || '',
    Phone: r.phone || '',
    Address_Line_1: r.address_line1 || '',
    Address_Line_2: r.address_line2 || '',
    City: r.city || '',
    State: r.state || '',
    Postal_Code: r.postal_code || '',
    Country: r.country || '',
    Property_ID: r.property_id || '',
    Property: r.property_name || '',
    Source: r.source || '',
    Reservation_Made_On: asDate(r.reservation_made_on),
    Arrival: asDate(r.arrival_date),
    Departure: asDate(r.departure_date),
    Adults: r.adult_count ?? '',
    Children: r.child_count ?? '',
    Status: r.status || '',
    Credit_Card_Collected_Offline: asYesNo(r.credit_card_collected_offline),
    Notes: r.notes || '',
    Rent_Total: asMoney(r.rent_total),
    Cleaning_Fee: asMoney(r.cleaning_fee),
    Gate_Fee: asMoney(r.gate_fee),
    Pet_Fee: asMoney(r.pet_fee),
    Golf_Cart_Fee: asMoney(r.golf_cart_fee),
    Other_Fee: asMoney(r.other_fee),
    Discount_Amount: asMoney(r.discount_amount),
    Adjustment_Amount: asMoney(r.adjustment_amount),
    Tax_Amount: asMoney(r.tax_amount),
    Guest_Service_Fee: asMoney(r.guest_service_fee),
    Payment_Processing_Fee: asMoney(r.payment_processing_fee),
    Platform_Fee: asMoney(r.platform_fee),
    Taxes_Paid_By_VRBO: asMoney(r.taxes_paid_by_vrbo),
    Amount_Paid_To_VRBO: asMoney(r.amount_paid_to_vrbo),
    Total_Guest_Payment: asMoney(r.total_guest_payment),
    Subtotal_Due_Owner: asMoney(r.subtotal_due_owner),
    Payout_To_Owner: asMoney(r.payout_to_owner),
    Agreement_Status: r.agreement_status || '',
    Agreement_Sent_Date: asDate(r.agreement_sent_at),
    Agreement_Received_Date: asDate(r.agreement_received_at),
    Agreement_Notes: r.agreement_notes || '',
    Review_Received: asYesNo(r.review_received),
    Review_Rating: r.review_rating ?? '',
    Review_Received_Date: asDate(r.review_received_at),
    Review_Text: r.review_text || '',
    ...Array.from({ length: maxPayments }).reduce((columns, _, index) => {
      const payment = Array.isArray(r.payments) ? r.payments[index] : null;
      return {
        ...columns,
        [`Payment_${index + 1}`]: payment ? formatPayment(payment) : '',
      };
    }, {}),
    Created_At: asDate(r.created_at),
    Updated_At: asDate(r.updated_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `reservations_${Date.now()}.xlsx`);
};
