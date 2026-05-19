'use client';

import { useMemo, useState } from 'react';

export default function useBookingFilters(bookings) {
    const [filters, setFilters] = useState({
        property: '',
        platform: '',
        startDate: '',
        endDate: '',
    });

    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {

            // PROPERTY FILTER
            const propertyMatch =
                !filters.property ||
                b.property_name === filters.property;

            // PLATFORM FILTER
            const platformMatch =
                !filters.platform ||
                b.platform === filters.platform;

            // DATE FILTER
            let dateMatch = true;

            if (filters.startDate && filters.endDate) {
                dateMatch =
                    new Date(b.start_date) <= new Date(filters.endDate) &&
                    new Date(b.end_date) >= new Date(filters.startDate);
            }

            return propertyMatch && platformMatch && dateMatch;
        });
    }, [bookings, filters]);

    return {
        filters,
        setFilters,
        filteredBookings,
    };
}