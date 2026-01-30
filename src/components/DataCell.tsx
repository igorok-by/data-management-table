import React, { memo, useState } from 'react';
import { TableCell, Box, useTheme, alpha, Tooltip } from '@mui/material';
import type { RowData, CellValue } from '@/types';
import type { EditedCell } from '@/hooks/useTableState';

export interface EditorProps {
  value: CellValue;
  onChange: (newValue: CellValue) => void;
  onCommit: () => void;
  onCancel: () => void;
  onError: (error: string | null) => void;
  autoFocus?: boolean;
}

interface DataCellProps {
  rowId: string;
  columnKey: keyof RowData;
  value: CellValue;
  editedCell?: EditedCell;
  isActive: boolean;
  isEditable?: boolean;
  hideTooltipOnEdit?: boolean;
  onUpdate: (rowId: string, columnKey: keyof RowData, newValue: CellValue) => void;
  onCancel: (rowId: string, columnKey: keyof RowData) => void;
  onActivate: (cellId: string) => void;
  onDeactivate: (cellId: string | null) => void;
  onError: (rowId: string, columnKey: keyof RowData, error: string | undefined) => void;
  renderEditor: (props: EditorProps) => React.ReactNode;
  renderViewer: (value: CellValue) => React.ReactNode;
}

export const DataCell = memo(
  ({
    editedCell,
    value,
    isActive,
    isEditable = true,
    hideTooltipOnEdit = false,
    onUpdate,
    onCancel,
    onActivate,
    onDeactivate,
    onError,
    renderEditor,
    renderViewer,
    rowId,
    columnKey,
  }: DataCellProps) => {
    const theme = useTheme();

    const displayValue = editedCell?.value !== undefined ? editedCell.value : value;
    const isDirty = editedCell !== undefined;
    const error = editedCell?.error;

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const isEditing = isActive && isEditable;
    const forceOpen = isEditing && !!error && !hideTooltipOnEdit;

    const handleStartEdit = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isEditable && !isEditing) onActivate(`${rowId}_${String(columnKey)}`);
    };

    const handleChange = (newValue: CellValue) => {
      onUpdate(rowId, columnKey, newValue);
    };

    const handleCommit = () => {
      if (error) return;

      onDeactivate(null);
    };

    const content = (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
          {isEditing
            ? renderEditor({
                value: displayValue,
                onChange: handleChange,
                onCommit: handleCommit,
                onCancel: () => onCancel(rowId, columnKey),
                onError: (err) => onError(rowId, columnKey, err || undefined),
                autoFocus: true,
              })
            : renderViewer(displayValue)}
        </Box>

        {error && (
          <Box
            component="span"
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'error.main',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    );

    return (
      <TableCell
        onClick={handleStartEdit}
        sx={{
          cursor: isEditable && !isEditing ? 'pointer' : 'default',
          backgroundColor: error
            ? alpha(theme.palette.error.main, 0.1)
            : isDirty
              ? alpha(theme.palette.warning.main, 0.1)
              : 'inherit',
          border: '1px solid transparent',
          borderColor: isEditing
            ? `${error ? theme.palette.error.main : theme.palette.primary.main}`
            : 'transparent',
          height: '56px',
          position: 'relative',
          p: 0,
          '&:hover': {
            backgroundColor:
              !isEditing && !error && !isDirty && isEditable
                ? alpha(theme.palette.action.hover, 0.1)
                : undefined,
          },
        }}
      >
        <Tooltip
          title={error || ''}
          arrow
          placement="top"
          disableHoverListener={!error}
          open={forceOpen || tooltipOpen}
          onOpen={() => setTooltipOpen(true)}
          onClose={() => setTooltipOpen(false)}
          slotProps={{
            popper: {
              sx: {
                zIndex: (theme) => theme.zIndex.tooltip + 2000,
                pointerEvents: 'none',
              },
            },
          }}
        >
          <Box sx={{ width: '100%', height: '100%' }}>{content}</Box>
        </Tooltip>
      </TableCell>
    );
  }
);
