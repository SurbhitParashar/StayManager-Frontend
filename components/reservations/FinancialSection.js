'use client';

const moneyFields = [
  ['rent_total', 'Total Rent'],
  ['cleaning_fee', 'Cleaning Fee'],
  ['gate_fee', 'Gate Fee'],
  ['pet_fee', 'Pet Fee'],
  ['golf_cart_fee', 'Golf Cart Fee'],
  ['other_fee', 'Other Fee'],
  ['discount_amount', 'Discount'],
  ['tax_amount', 'Tax'],
  ['taxes_paid_by_vrbo', 'Taxes Paid By VRBO'],
  ['guest_service_fee', 'Guest Service Fee'],
  ['payment_processing_fee', 'Processing Fee'],
  ['platform_fee', 'Platform Fee'],
  ['amount_paid_to_vrbo', 'Amount Paid To VRBO'],
  ['total_guest_payment', 'Total Guest Payment'],
  ['subtotal_due_owner', 'Subtotal Due Owner'],
  ['payout_to_owner', 'Payout To Owner'],
];

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
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

const toNumber = (value) => Number(value || 0);

export default function FinancialSection({ value, onChange, numberOfNights }) {
  const amountPaidToVrbo =
    toNumber(value.taxes_paid_by_vrbo) +
    toNumber(value.guest_service_fee) +
    toNumber(value.payment_processing_fee);
  const rentPerNight = numberOfNights > 0 ? toNumber(value.rent_total) / numberOfNights : 0;
  const balanceDifference = toNumber(value.total_guest_payment) - (amountPaidToVrbo + toNumber(value.payout_to_owner));

  const setField = (field, nextValue) => {
    const next = { ...value, [field]: nextValue };
    next.amount_paid_to_vrbo =
      toNumber(next.taxes_paid_by_vrbo) +
      toNumber(next.guest_service_fee) +
      toNumber(next.payment_processing_fee);
    onChange(next);
  };

  return (
    <section style={{ display: 'grid', gap: '14px' }}>
      <div style={styles.summaryGrid}>
        <Summary label="No. of Nights" value={numberOfNights || 0} />
        <Summary label="Rent Per Night" value={`$${rentPerNight.toFixed(2)}`} />
        <Summary label="Paid To VRBO" value={`$${amountPaidToVrbo.toFixed(2)}`} />
        <Summary
          label="Balance Check"
          value={Math.abs(balanceDifference) < 0.01 ? 'Balanced' : `$${balanceDifference.toFixed(2)} off`}
          tone={Math.abs(balanceDifference) < 0.01 ? 'ok' : 'warn'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {moneyFields.map(([field, label]) => (
          <div key={field}>
            <label style={styles.label}>{label}</label>
            <input
              style={{ ...inputStyle, background: field === 'amount_paid_to_vrbo' ? '#F5F4F0' : '#fff' }}
              type="number"
              min="0"
              step="0.01"
              value={field === 'amount_paid_to_vrbo' ? amountPaidToVrbo : value[field] ?? ''}
              onChange={(e) => setField(field, e.target.value)}
              readOnly={field === 'amount_paid_to_vrbo'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Summary({ label, value, tone }) {
  return (
    <div style={{
      ...styles.summary,
      borderColor: tone === 'warn' ? '#F59E0B' : '#E4E2DC',
      color: tone === 'warn' ? '#92400E' : '#1A1A1A',
    }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#6B6860',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  summary: {
    display: 'grid',
    gap: '4px',
    padding: '12px',
    border: '1px solid #E4E2DC',
    borderRadius: '8px',
    background: '#FAFAF8',
    fontSize: '12px',
  },
};
