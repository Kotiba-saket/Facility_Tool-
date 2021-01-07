import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportedArray: any = [];
  constructor() {}

  /**
   * This method contains the logic to export an order or report as an excel file
   * @param dataSource this is the source of the data to be exported
   * @param prefix this is the prefix to the name
   * @param sheetName this is the name of the excel sheet
   */
  ExportData(dataSource,  prefix, sheetName) {
    this.exportedArray = [];
    dataSource.filteredData.forEach((element) => {
      let assignTo;
      delete element.reporterId;
      delete element.closeTo;
      delete element.statusHistory;
      delete element.subscribers;
      element.bytes = null;
      if (element.assignTo === null || element.assignTo === undefined) {
        assignTo = 'nog niet toegewezen';
      } else {
        assignTo = element.assignTo.displayName;
      }

      delete element.assignTo;
      element.AssignTo = assignTo;
      this.exportedArray.push(element);
    });
    const timeSpan = new Date().toISOString();
    const prefix1 = prefix;
    const fileName = `${prefix1}-${timeSpan}`;
    const workSheet = XLSX.utils.json_to_sheet(this.exportedArray);

    const workBook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, sheetName);

    /**
     * set width voor elke Cell
     */
    const wscols = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 5 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
    ];
    workSheet['!cols'] = wscols;

    const range = XLSX.utils.decode_range(workSheet['!ref']);
    for (let C = range.s.r; C <= range.e.r; ++C) {
      const address = XLSX.utils.encode_col(C) + '1'; // <-- first row, column number C
      if (!workSheet[address]) {
        continue;
      }
      workSheet[address].v = workSheet[address].v.toUpperCase();
    }

    XLSX.writeFile(workBook, `${fileName}.xlsx`);
  }
}
