import { useLocalized } from '../hooks/useLocalized'
import type { Table } from '../types'
import RichText from './RichText'

interface DataTableProps {
  table: Table
}

function DataTable({ table }: DataTableProps) {
  const loc = useLocalized()

  return (
    <div className="overflow-x-auto rounded-xl border border-line-soft bg-surface-raised">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-secondary-100 dark:bg-espresso-700/60">
          <tr>
            {table.headers.map((header, index) => (
              <th key={index} scope="col" className="min-w-24 px-3 py-2.5 align-bottom font-semibold text-label">
                {loc(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-line-soft even:bg-surface/60">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-3 py-2.5 align-top ${cellIndex === 0 ? 'font-medium text-fg' : 'text-fg/90'}`}>
                  <RichText text={loc(cell)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
