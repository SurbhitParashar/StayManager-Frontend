import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatBookingsForExport } from './bookingExportFormatter';

export const exportToExcel = (bookings) => {

    const formattedData = formatBookingsForExport(bookings);

    // CREATE WORKSHEET
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // CREATE WORKBOOK
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Bookings'
    );

    // GENERATE EXCEL BUFFER
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    // CREATE FILE
    const fileData = new Blob(
        [excelBuffer],
        {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        }
    );

    saveAs(
        fileData,
        `bookings_${Date.now()}.xlsx`
    );
};