/**
 * Parses RFC 4180 CSV into rows keyed by the header line. Quoted fields may hold commas,
 * line breaks and doubled quotes (""). Cells are trimmed and blank lines are skipped, so
 * a file saved from Excel or Google Sheets reads the same as a hand-written one.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const input = text.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char !== '"') field += char;
      else if (input[i + 1] === '"') field += input[++i];
      else quoted = false;
    } else if (char === '"' && field.trim() === '') {
      quoted = true;
      field = '';
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('CSV ends inside a quoted field');
  if (field !== '' || row.length > 0) rows.push([...row, field]);

  const [header, ...body] = rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
  if (!header) return [];
  const names = header.map((name) => name.trim());
  return body.map((cells) => Object.fromEntries(names.map((name, index) => [name, (cells[index] ?? '').trim()])));
}
