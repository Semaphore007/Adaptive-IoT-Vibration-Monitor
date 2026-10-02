export const EXPECTED_COLUMNS = [
  'timestamp',
  'vibration',
  'sampling_rate',
  'transmission_rate',
  'processing_rate',
  'packets_sent',
  'energy',
  'detection',
  'latency',
] as const

export type CsvColumn = (typeof EXPECTED_COLUMNS)[number]
export type CsvRow = Partial<Record<CsvColumn, number>>

export interface ParsedCsv {
  rows: CsvRow[]
  columns: CsvColumn[]
  missing: CsvColumn[]
  skipped: number
}

const MAX_ROWS = 20000

export function parseCsv(text: string): ParsedCsv {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim().length > 0)
  if (lines.length < 2) throw new Error('The file needs a header row and at least one data row.')

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const columns = EXPECTED_COLUMNS.filter((c) => header.includes(c))
  if (columns.length === 0) throw new Error('None of the expected column names were found in the header row.')
  const missing = EXPECTED_COLUMNS.filter((c) => !header.includes(c))

  const rows: CsvRow[] = []
  let skipped = 0
  for (const line of lines.slice(1, MAX_ROWS + 1)) {
    const cells = line.split(',')
    const row: CsvRow = {}
    let valid = false
    for (const col of columns) {
      const raw = cells[header.indexOf(col)]?.trim().toLowerCase()
      const value = raw === 'true' ? 1 : raw === 'false' ? 0 : Number(raw)
      if (raw !== undefined && raw !== '' && Number.isFinite(value)) {
        row[col] = value
        valid = true
      }
    }
    if (valid) rows.push(row)
    else skipped++
  }
  if (rows.length === 0) throw new Error('No numeric rows could be parsed from the file.')
  return { rows, columns, missing, skipped }
}
