'use client';

export default function BookingFilters({
    filters,
    setFilters,
    properties,
    platforms,
}) {
    const handleChange = (e) => {
        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const hasActiveFilters =
        filters.property || filters.platform || filters.startDate || filters.endDate;

    const clearFilters = () => {
        setFilters({ property: '', platform: '', startDate: '', endDate: '' });
    };

    const selectStyle = {
        height: '40px',
        padding: '0 36px 0 14px',
        border: '1.5px solid #E4E2DC',
        borderRadius: '8px',
        background: `#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6860' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 12px center`,
        appearance: 'none',
        WebkitAppearance: 'none',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13.5px',
        color: '#1A1A1A',
        cursor: 'pointer',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        minWidth: '160px',
    };

    const inputStyle = {
        height: '40px',
        padding: '0 14px',
        border: '1.5px solid #E4E2DC',
        borderRadius: '8px',
        background: '#fff',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13.5px',
        color: '#1A1A1A',
        outline: 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        minWidth: '150px',
    };

    const focusHandlers = (e) => {
        e.target.style.borderColor = '#3B82F6';
        e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
    };
    const blurHandlers = (e) => {
        e.target.style.borderColor = '#E4E2DC';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E4E2DC',
            background: '#FAFAF8',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
        }}>
            {/* Label */}
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#9E9C97',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginRight: '4px',
                whiteSpace: 'nowrap',
            }}>
                Filter by
            </span>

            {/* Property */}
            <select
                name="property"
                value={filters.property}
                onChange={handleChange}
                onFocus={focusHandlers}
                onBlur={blurHandlers}
                style={selectStyle}
            >
                <option value="">All Properties</option>
                {properties.map((p) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            {/* Platform */}
            <select
                name="platform"
                value={filters.platform}
                onChange={handleChange}
                onFocus={focusHandlers}
                onBlur={blurHandlers}
                style={selectStyle}
            >
                <option value="">All Platforms</option>
                {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', background: '#E4E2DC', margin: '0 4px' }} />

            {/* Date range label */}
            <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#9E9C97',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                whiteSpace: 'nowrap',
            }}>
                Stay range
            </span>

            {/* Start Date */}
            <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                onFocus={focusHandlers}
                onBlur={blurHandlers}
                style={inputStyle}
            />

            <span style={{ color: '#9E9C97', fontSize: '14px', fontWeight: '500' }}>→</span>

            {/* End Date */}
            <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                onFocus={focusHandlers}
                onBlur={blurHandlers}
                style={inputStyle}
            />

            {/* Clear Button */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    style={{
                        height: '40px',
                        padding: '0 16px',
                        border: '1.5px solid #E4E2DC',
                        borderRadius: '8px',
                        background: '#fff',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '13px',
                        color: '#6B6860',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                        marginLeft: 'auto',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#F5F5F3';
                        e.currentTarget.style.borderColor = '#C8C6BF';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#E4E2DC';
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1l10 10M11 1L1 11" stroke="#9E9C97" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Clear filters
                </button>
            )}
        </div>
    );
}