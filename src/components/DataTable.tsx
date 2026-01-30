import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import type { RowData, CellValue } from '@/types';
import DataRow from '@/components/DataRow';
import type { EditedCell, CellId } from '@/hooks/useTableState';

interface DataTableProps {
  data: RowData[];
  loading: boolean;
  editedCells: Record<CellId, EditedCell>;
  activeCell: CellId | null;
  onCellUpdate: (rowId: string, columnKey: keyof RowData, newValue: CellValue) => void;
  onCellError: (rowId: string, columnKey: keyof RowData, error: string | undefined) => void;
  onCancelEdit: (rowId: string, columnKey: keyof RowData) => void;
  onSetActiveCell: (cellId: CellId | null) => void;
}

const COLUMN_CONFIG = [
  { key: 'id', label: 'ID', width: 100 },
  { key: 'name', label: 'Name', width: 200 },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'count', label: 'Count', width: 100 },
  { key: 'price', label: 'Price', width: 100 },
  { key: 'created_at', label: 'Created At', width: 220 },
  { key: 'updated_at', label: 'Updated At', width: 220 },
  { key: 'tags', label: 'Tags', width: 270 },
  { key: 'metadata', label: 'Metadata', width: 80 },
] as const;

const TOTAL_TABLE_WIDTH = COLUMN_CONFIG.reduce((acc, curr) => acc + curr.width, 0);

const DataTable = ({
  data,
  loading,
  editedCells,
  activeCell,
  onCellUpdate,
  onCellError,
  onCancelEdit,
  onSetActiveCell,
}: DataTableProps) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          maxHeight: 'calc(100vh - 100px)',
          maxWidth: '100%',
          width: 'auto',
        }}
      >
        <Table stickyHeader size="small" sx={{ width: TOTAL_TABLE_WIDTH, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {COLUMN_CONFIG.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    fontWeight: 'bold',
                    width: col.width,
                    minWidth: col.width,
                    backgroundColor: 'grey.100',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <DataRow
                key={row.id}
                index={index}
                row={row}
                editedCells={editedCells}
                activeCell={activeCell}
                onUpdate={onCellUpdate}
                onError={onCellError}
                onCancel={onCancelEdit}
                onSetActiveCell={onSetActiveCell}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;
