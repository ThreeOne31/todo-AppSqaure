import {
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import {
  rankItem,
} from '@tanstack/match-sorter-utils'
import { Columns } from './Home';

type Props = {
  rows: any;
  columns: Columns;
};

export const DataTable = ((props: Props) => {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const todos = useMemo(() => props.rows, [props.rows])


  const table = useReactTable({
    data: todos,
    columns: props.columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: false,
    // debugHeaders: false,
    // debugColumns: false,
  })

  console.log('Datatable todos: ', todos)
  return (
    <div className='p-2'>
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className='p-2 font-lg shadow border border-block w-full'
          placeholder='Search todos...'
        />
      </div>
      <div className='h-2'/>
      <table className='w-full border  border-gray-200'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr 
              key={headerGroup.id}
              className='border-b border-gray-200 p-4'
            >
              {headerGroup.headers.map(header => {
                return (
                  <th 
                    key={header.id}
                    colSpan={header.colSpan}
                    className='p-2 text-xl text-left'
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() ? {
                            asc:
                            <span className="pl-2 font-extrabold text-gray-400">
                              <span className="text-white font-black">
                                &uarr;
                              </span>
                              &darr;
                            </span>,
                            desc:
                            <span className="pl-2 font-extrabold text-gray-400">
                              <span className="text-white font-black">
                                &darr;
                              </span>
                              &uarr;
                            </span>,
                          }[header.column.getIsSorted() as string] ?? 
                            <span className="pl-2 font-extrabold text-gray-400">
                              &uarr;&darr;
                            </span> : null
                          }
                        </div>
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr 
                key={row.id}
                className='border-b border-gray-200 hover:bg-gray-100 p-4'
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <td
                      key={cell.id}
                      className='p-2'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
})




const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })
  return itemRank.passed
}


// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
