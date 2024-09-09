import { useState } from 'react'

import {
  DataGrid,
  GridColDef as MuiGridColDef,
  GridToolbar,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid'

import { Box } from '@mui/material'

import { useRect } from '@/hooks/use-rect'

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${NestedKeyOf<T[K]>}` : K
    }[keyof T & string]
  : never

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

type DeepKeys<T> = Expand<NestedKeyOf<T>>

export type GridColDef<T> = Partial<Omit<MuiGridColDef, 'field' | 'renderCell' | 'hiddenCell'>> & {
  headerName?: string | React.ReactNode
  field?: DeepKeys<T>
  renderCell?: (params: { row: T }) => React.ReactNode
}

type Props<T> = {
  row: Array<T> | undefined
  columns: Array<GridColDef<T>>
}

export const DataGridCustom = <T,>({ row, columns }: Props<T>) => {
  const { reference, screenHeight } = useRect('resize')

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    id: false,
  })

  const position = reference.current?.getBoundingClientRect()
  const height = screenHeight - Number(position?.top ?? 0) - 20

  const handleChangeColumnVisibilityModel = (newModel: GridColumnVisibilityModel) => {
    setColumnVisibilityModel(newModel)
  }

  return (
    <Box ref={reference} sx={{ height, width: '100%' }}>
      <DataGrid
        disableRowSelectionOnClick
        rows={row || []}
        columns={columns as MuiGridColDef[]}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleChangeColumnVisibilityModel}
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          '&.MuiDataGrid-root .MuiDataGrid-container--top [role=row]': {
            backgroundColor: 'background.neutral',
            borderRadius: 0,
          },
          '&.MuiDataGrid-root .MuiDataGrid-main>*:first-of-type': {
            borderRadius: 0,
          },
        }}
        slots={{
          toolbar: () => (
            <GridToolbar
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: '10px 0px',
              }}
            />
          ),
        }}
      />
    </Box>
  )
}
