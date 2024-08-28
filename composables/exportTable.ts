// utils/exportTable.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportTableToExcel(tableId:string, fileName = 'table-data.xlsx') {
  const table = document.getElementById(tableId);
  const worksheet = XLSX.utils.table_to_sheet(table);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, fileName);
}

export function exportTableToCSV(tableId:string, fileName = 'table-data.csv') {
  const table = document.getElementById(tableId);
  const worksheet = XLSX.utils.table_to_sheet(table);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}
