'use client';

const inputStyle = {
  width: '100%',
  padding: '9px 10px',
  border: '1px solid #E4E2DC',
  borderRadius: '8px',
  fontSize: '13px',
  color: '#111827',
  background: '#FFFFFF',
  fontWeight: 500,
  lineHeight: '1.35',
  boxSizing: 'border-box',
  opacity: 1,
};

export default function PaymentSchedule({ payments, onChange, arrivalDate, totalAmount, isDirectRental }) {
  const setPayment = (index, field, value) => {
    const next = [...payments];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const addPayment = () => {
    onChange([
      ...payments,
      {
        payment_number: payments.length + 1,
        due_date: '',
        amount_due: '',
        paid_date: '',
        amount_paid: '',
        payment_method: '',
        payment_status: 'pending',
        notes: '',
      },
    ]);
  };

  const removePayment = (index) => {
    onChange(payments.filter((_, i) => i !== index));
  };

  const createDirectSchedule = () => {
    const total = Number(totalAmount || 0);
    const secondDue = arrivalDate ? new Date(`${arrivalDate}T00:00:00`) : null;
    if (secondDue) secondDue.setDate(secondDue.getDate() - 60);

    onChange([
      {
        payment_number: 1,
        due_date: '',
        amount_due: total ? (total / 2).toFixed(2) : '',
        paid_date: '',
        amount_paid: '',
        payment_method: 'direct',
        payment_status: 'pending',
        notes: 'Due on reservation confirmation',
      },
      {
        payment_number: 2,
        due_date: secondDue ? secondDue.toISOString().slice(0, 10) : '',
        amount_due: total ? (total / 2).toFixed(2) : '',
        paid_date: '',
        amount_paid: '',
        payment_method: 'direct',
        payment_status: 'pending',
        notes: 'Due 60 days before arrival',
      },
    ]);
  };

  return (
    <section style={{ display: 'grid', gap: '10px' }}>
      {isDirectRental && (
        <button type="button" onClick={createDirectSchedule} style={styles.direct}>
          Create Direct Rental 2-Payment Schedule
        </button>
      )}
      {payments.map((payment, index) => (
        <div key={index} style={styles.row}>
          <input style={inputStyle} type="number" value={payment.payment_number || ''} onChange={(e) => setPayment(index, 'payment_number', e.target.value)} placeholder="#" />
          <input style={inputStyle} type="date" value={payment.due_date || ''} onChange={(e) => setPayment(index, 'due_date', e.target.value)} />
          <input style={inputStyle} type="number" value={payment.amount_due || ''} onChange={(e) => setPayment(index, 'amount_due', e.target.value)} placeholder="Due" />
          <input style={inputStyle} type="date" value={payment.paid_date || ''} onChange={(e) => setPayment(index, 'paid_date', e.target.value)} />
          <input style={inputStyle} type="number" value={payment.amount_paid || ''} onChange={(e) => setPayment(index, 'amount_paid', e.target.value)} placeholder="Paid" />
          <select style={inputStyle} value={payment.payment_status || 'pending'} onChange={(e) => setPayment(index, 'payment_status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input style={inputStyle} value={payment.notes || ''} onChange={(e) => setPayment(index, 'notes', e.target.value)} placeholder="Notes" />
          <button type="button" onClick={() => removePayment(index)} style={styles.remove}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addPayment} style={styles.add}>Add Payment</button>
    </section>
  );
}

const styles = {
  row: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 1fr 1fr 1fr 130px 1.4fr 90px',
    gap: '8px',
    alignItems: 'center',
  },
  direct: {
    justifySelf: 'start',
    border: '1px solid #10B981',
    background: '#ECFDF5',
    color: '#047857',
    borderRadius: '8px',
    padding: '9px 12px',
    cursor: 'pointer',
  },
  add: {
    justifySelf: 'start',
    border: '1px solid #C8D9F8',
    background: '#EEF4FF',
    color: '#1A56DB',
    borderRadius: '8px',
    padding: '9px 12px',
    cursor: 'pointer',
  },
  remove: {
    border: '1px solid #F4C0BC',
    background: '#FFF0F0',
    color: '#C5221F',
    borderRadius: '8px',
    padding: '9px 10px',
    cursor: 'pointer',
  },
};
