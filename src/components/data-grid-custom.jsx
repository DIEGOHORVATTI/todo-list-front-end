import { useState } from 'react'

import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid'

import { Box } from '@mui/material'

import { useRect } from '@/hooks/use-rect'


export const DataGridCustom = ({ row, columns }) => {
  const { reference, screenHeight } = useRect('resize')

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
  })

  const position = reference.current?.getBoundingClientRect()
  const height = screenHeight - Number(position?.top ?? 0) - 20

  const handleChangeColumnVisibilityModel = (newModel) => {
    setColumnVisibilityModel(newModel)
  }

  return (
    <Box ref={reference} sx={{ height, width: '100%' }}>
      <DataGrid
        disableRowSelectionOnClick
        rows={row || []}
        columns={columns}
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
