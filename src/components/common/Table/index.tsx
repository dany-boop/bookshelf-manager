'use client';
import React, { FC, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Book } from '@prisma/client';
// import { DownloadTableExcel } from 'react-export-table-to-excel';

// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import autoTable from 'jspdf-autotable';

type Props = {
  books: Book[];
  loading?: boolean;
  title?: string;
  openForm: (book?: Book | null | undefined) => void;
};

const BooksTable: FC<Props> = ({ books, loading, title, openForm }) => {
  const tableRef = useRef(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Book;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    namaGrup: '',
    saldoTahunIni: '',
    saldoProyeksi: '',
    saldoTahunLalu: '',
    saldoPencapaian: '',
  });

  const handleColumnFilterChange = (key: string, value: string) => {
    setColumnFilters({ ...columnFilters, [key]: value });
  };

  const handleSort = (key: keyof Book) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
  };

  const sortedBooks = React.useMemo(() => {
    let sortableBooks = [...books];
    if (sortConfig) {
      sortableBooks.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        // Compare defined values
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableBooks;
  }, [books, sortConfig]);

  const filteredBooks = sortedBooks.filter((book) =>
    Object.values(book).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // const handlePdfExport = () => {
  //   const pageWidth = 297; // A4 width in mm
  //   const pageHeight = 210; // A4 height in mm
  //   const customDoc = new jsPDF({
  //     orientation: 'landscape', // Landscape orientation for wider tables
  //     unit: 'mm',
  //     format: [pageWidth + 50, pageHeight], // Increased width (50 mm extra)
  //     hotfixes: ['px_scaling'], // To fix any scaling issues
  //   });

  //   const accentColor = getComputedStyle(document.documentElement)
  //     .getPropertyValue('--color-accent')
  //     .trim();
  //   const rgbColor = convertCssColorToRgb(accentColor);

  // Define headers

  //   // Add data to PDF
  //   const name = `Table Rekap Perbandingan Laba Rugi ${title}`;
  //   customDoc.text(name, 14, 15);

  //   // Add data to PDF with enhanced styling
  //   autoTable(customDoc, {
  //     head: [tableColumn, subHeader],
  //     body: tableRows,
  //     startY: 30,
  //     theme: 'striped',
  //     headStyles: {
  //       fillColor: rgbColor || [34, 34, 34],
  //       textColor: [255, 255, 255],
  //       halign: 'center',
  //       cellPadding: 5,
  //     },
  //     styles: {
  //       cellPadding: 5,
  //       fontSize: 10,
  //       valign: 'middle',
  //       halign: 'center',
  //       minCellHeight: 10,
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 50, overflow: 'linebreak' }, // Wrap header, no wrap for data
  //       1: { cellWidth: 40 },
  //       2: { cellWidth: 40 },
  //       3: { cellWidth: 40 },
  //       4: { cellWidth: 40 },
  //       5: { cellWidth: 30 },
  //       6: { cellWidth: 40 },
  //       7: { cellWidth: 30 },
  //     },
  //     didParseCell: (data) => {
  //       // Prevent wrapping in data rows
  //       if (data.row.index > 0) {
  //         data.cell.styles.overflow = 'linebreak'; // No wrap for data cells
  //         data.cell.styles.cellWidth = 'auto'; // Automatic width for data cells
  //       }
  //     },
  //   });

  //   customDoc.save(`table-rekap-perbandingan-laba-rugi-${title}.pdf`);
  // };

  // const handlePrint = () => {
  //   const printContent = tableRef.current?.innerHTML;
  //   const windowPrint = window.open("", "_blank");
  //   windowPrint.document?.write(`
  //     <html>
  //       <head>
  //         <title>Print Table</title>
  //         <style>
  //           table { width: 100%; border-collapse: collapse; }
  //           th, td { border: 1px solid black; padding: 8px; text-align: center; }
  //         </style>
  //       </head>
  //       <body onload="window.print();window.close()">
  //         ${printContent}
  //       </body>
  //     </html>
  //   `);
  //   windowPrint.document.close();
  //   windowPrint.focus();
  // };

  return (
    <div className="p-5 ">
      <div className="flex justify-between">
        {/* <Popover>
          <PopoverTrigger className="hover:bg-[--bg-tertiary] transition-all duration-75 ease-in-out p-3 rounded-lg">
            <Icon
              icon="solar:folder-with-files-line-duotone"
              width={30}
              className="text-[--text-color]"
            />
          </PopoverTrigger>
          <PopoverContent className="bg-[--bg-container]">
            <DownloadTableExcel
              filename={`table-rekap-perbandingan-laba-rugi-${title}`}
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <button className="text-[--text-color] hover:bg-[--bg-tertiary] w-full rounded-xl p-2 transition-all duration-300 flex gap-5">
                <Icon
                  icon="ri:file-excel-2-line"
                  width={30}
                  className="text-green-600"
                />
                <span className="my-auto">Export ke Excel</span>
              </button>
            </DownloadTableExcel>
            <button
              onClick={handlePdfExport}
              className="text-[--text-color] hover:bg-[--bg-tertiary] w-full rounded-xl p-2 transition-all duration-300 flex gap-5"
            >
              <Icon
                icon="ri:file-pdf-2-line"
                width={30}
                className="text-red-600"
              />
              <span className="my-auto">Export ke Pdf</span>
            </button>
          </PopoverContent>
        </Popover> */}

        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableCell
              onClick={() => handleSort('title')}
              className="cursor-pointer"
            >
              Title{' '}
              {sortConfig?.key === 'title'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </TableCell>
            <TableCell
              onClick={() => handleSort('author')}
              className="cursor-pointer"
            >
              Author{' '}
              {sortConfig?.key === 'author'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </TableCell>
            <TableCell
              onClick={() => handleSort('category')}
              className="cursor-pointer"
            >
              Category{' '}
              {sortConfig?.key === 'category'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </TableCell>
            <TableCell
              onClick={() => handleSort('status')}
              className="cursor-pointer"
            >
              Status{' '}
              {sortConfig?.key === 'status'
                ? sortConfig.direction === 'asc'
                  ? '↑'
                  : '↓'
                : ''}
            </TableCell>
            <TableCell className="cursor-pointer">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>
                <Button
                  onClick={() => openForm(book)} // Open the form with the book to edit
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Edit
                </Button>
                <Button></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BooksTable;
