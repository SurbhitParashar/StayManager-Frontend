export const formatBookingsForExport = (bookings) => {
    return bookings.map((b) => ({
        Guest: b.name,
        Property: b.property_name,
        Platform: b.platform,
        Start_Date: b.start_date,
        End_Date: b.end_date,
        Amount: Number(b.total_amount),
        Status: b.status,
    }));
};