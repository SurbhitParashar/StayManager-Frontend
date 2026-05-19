export const calculateKPIs = (bookings) => {

    const totalRevenue = bookings.reduce(
        (sum, b) => sum + Number(b.total_amount),
        0
    );

    const totalBookings = bookings.length;

    const averageBookingValue =
        totalBookings > 0
            ? totalRevenue / totalBookings
            : 0;

    return {
        totalRevenue,
        totalBookings,
        averageBookingValue,
    };
};

export const monthlyRevenueData = (bookings) => {

    const monthly = {};

    bookings.forEach((b) => {

        const date = new Date(b.start_date);

        const month = date.toLocaleString('default', {
            month: 'short',
        });

        if (!monthly[month]) {
            monthly[month] = 0;
        }

        monthly[month] += Number(b.total_amount);
    });

    return Object.entries(monthly).map(
        ([month, revenue]) => ({
            month,
            revenue,
        })
    );
};

export const platformDistributionData = (bookings) => {

    const platforms = {};

    bookings.forEach((b) => {

        const platform = b.platform || 'unknown';

        if (!platforms[platform]) {
            platforms[platform] = 0;
        }

        platforms[platform]++;
    });

    return Object.entries(platforms).map(
        ([name, value]) => ({
            name,
            value,
        })
    );
};

export const propertyRevenueData = (bookings) => {

    const properties = {};

    bookings.forEach((b) => {

        const property = b.property_name;

        if (!properties[property]) {
            properties[property] = 0;
        }

        properties[property] += Number(b.total_amount);
    });

    return Object.entries(properties).map(
        ([property, revenue]) => ({
            property,
            revenue,
        })
    );
};