import { greenBright } from 'colorette'
import { Table } from 'console-table-printer'
import fileSize from 'filesize'

export interface SummaryDetails {
  fileName: string
  size: number
  minifiedSize: number
  brotliSize: number
  gzippedSize: number
}

export const printSummaryTable = (summary: SummaryDetails[]) => {
  const totalSize: Omit<SummaryDetails, 'fileName'> = {
    size: 0,
    minifiedSize: 0,
    brotliSize: 0,
    gzippedSize: 0,
  }

  summary.forEach((file) => {
    totalSize.size += file.size
    totalSize.minifiedSize += file.minifiedSize
    totalSize.gzippedSize += file.gzippedSize
    totalSize.brotliSize += file.brotliSize
  })

  const table = new Table({
    columns: [
      { name: 'column1', title: 'Name', alignment: 'left', color: 'cyan' },
      { name: 'column2', title: 'Size', alignment: 'left', color: 'yellow' },
      { name: 'column3', title: 'Minified', color: 'yellow' },
      { name: 'column4', title: 'Gzipped', color: 'yellow' },
      { name: 'column5', title: 'Brotli', color: 'yellow' },
    ],
    rows: summary.map((info) => {
      return {
        column1: info.fileName,
        column2: fileSize(info.size),
        column3: fileSize(info.minifiedSize),
        column4: fileSize(info.gzippedSize),
        column5: fileSize(info.brotliSize),
      }
    }),
    style: {
      headerTop: {
        left: '',
        mid: '',
        right: '',
        other: '',
      },
      headerBottom: {
        left: '',
        mid: '-',
        right: '',
        other: '-',
      },
      tableBottom: {
        left: '',
        mid: '',
        right: '',
        other: '',
      },
      vertical: '',
    },
  })

  table.addRow({
    column1: greenBright('Total'),
    column2: greenBright(fileSize(totalSize.size)),
    column3: greenBright(fileSize(totalSize.minifiedSize)),
    column4: greenBright(fileSize(totalSize.gzippedSize)),
    column5: greenBright(fileSize(totalSize.brotliSize)),
  })

  table.printTable()
}
