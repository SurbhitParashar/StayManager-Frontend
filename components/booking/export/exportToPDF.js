import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatBookingsForExport } from './bookingExportFormatter';

export const exportToPDF = (bookings) => {

    const doc = new jsPDF();

    const formattedData = formatBookingsForExport(bookings);

    // TITLE
    doc.setFontSize(18);

    doc.text('Booking Report', 14, 20);

    // TABLE
    autoTable(doc, {
        startY: 30,

        head: [[
            'Guest',
            'Property',
            'Platform',
            'Start',
            'End',
            'Amount',
            'Status',
        ]],

        body: formattedData.map((b) => ([
            b.Guest,
            b.Property,
            b.Platform,
            b.Start_Date,
            b.End_Date,
            `$${b.Amount}`,
            b.Status,
        ])),

        styles: {
            fontSize: 10,
        },

        headStyles: {
            fillColor: [26, 26, 26],
        },
    });

    // SAVE PDF
    doc.save(`bookings_${Date.now()}.pdf`);
};