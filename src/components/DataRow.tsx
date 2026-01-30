import { memo } from 'react';
import {
  TableRow,
  TableCell,
  Chip,
  Box,
  Typography,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import { DataCell, type EditorProps } from '@/components/DataCell';
import TextEditor from '@/components/editors/TextEditor';
import EnumEditor from '@/components/editors/EnumEditor';
import DateEditor from '@/components/editors/DateEditor';
import TagsEditor from '@/components/editors/TagsEditor';
import JsonEditor from '@/components/editors/JsonEditor';
import dayjs from 'dayjs';
import { RowStatus } from '@/types';
import type { RowData, CellValue, RowStatusValue } from '@/types';
import { type EditedCell, type CellId, getCellId } from '@/hooks/useTableState';

interface DataRowProps {
  index: number;
  row: RowData;
  editedCells: Record<string, EditedCell>;
  activeCell: CellId | null;
  onUpdate: (rowId: string, columnKey: keyof RowData, newValue: CellValue) => void;
  onError: (rowId: string, columnKey: keyof RowData, error: string | undefined) => void;
  onCancel: (rowId: string, columnKey: keyof RowData) => void;
  onSetActiveCell: (cellId: CellId | null) => void;
}

const STATUS_COLORS = {
  [RowStatus.ACTIVE]: 'success',
  [RowStatus.INACTIVE]: 'default',
  [RowStatus.DRAFT]: 'warning',
} as const;
const MAX_TAGS = 3;

const renderTextEditor = (props: EditorProps) => <TextEditor {...props} />;
const renderNumberEditor = (props: EditorProps) => <TextEditor {...props} type="number" />;
const renderEnumEditor = (props: EditorProps) => <EnumEditor {...props} />;
const renderDateEditor = (props: EditorProps) => <DateEditor {...props} />;
const renderTagsEditor = (props: EditorProps) => <TagsEditor {...props} />;
const renderJsonEditor = (props: EditorProps) => <JsonEditor {...props} />;

const renderStringViewer = (val: CellValue) => val as string;
const renderStatusViewer = (val: CellValue) => {
  const status = val as RowStatusValue;

  return <Chip label={status} size="small" color={STATUS_COLORS[status]} variant="outlined" />;
};
const renderNumberViewer = (val: CellValue) => (val as number) ?? '-';
const renderPriceViewer = (val: CellValue) => (val !== null ? `$${Number(val).toFixed(2)}` : '-');
const renderDateViewer = (val: CellValue) =>
  val ? dayjs(val as string).format('YYYY-MM-DD HH:mm') : '-';

const renderMetadataViewer = (val: CellValue) => {
  const jsonString = JSON.stringify(val, null, 2);

  return (
    <Tooltip
      title={
        <Box
          sx={{
            maxHeight: 400,
            maxWidth: 500,
            overflow: 'auto',
            p: 0.5,
          }}
        >
          <pre style={{ margin: 0, fontSize: '0.75rem' }}>{jsonString}</pre>
        </Box>
      }
      placement="left"
      arrow
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' }}
        >
          {'{...}'}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const renderTagsViewer = (val: CellValue) => {
  const tags = val as string[];
  const hasMore = tags.length > MAX_TAGS;
  const displayTags = hasMore ? tags.slice(0, MAX_TAGS) : tags;

  const content = (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      {displayTags.map((tag, i) => (
        <Chip key={i} label={tag} size="small" />
      ))}
      {hasMore && <Chip label={`+${tags.length - MAX_TAGS}`} size="small" variant="outlined" />}
    </Box>
  );

  if (!hasMore) return content;

  return (
    <Tooltip
      title={
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 0.5 }}>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
            />
          ))}
        </Box>
      }
      arrow
      placement="top"
    >
      {content}
    </Tooltip>
  );
};

const DataRow = memo(
  ({
    index,
    row,
    editedCells,
    activeCell,
    onUpdate,
    onError,
    onCancel,
    onSetActiveCell,
  }: DataRowProps) => {
    const theme = useTheme();
    const getCellProps = (key: keyof RowData) => {
      const cellId = getCellId(row.id, key);
      const isActive = activeCell === cellId;

      return {
        rowId: row.id,
        columnKey: key,
        value: row[key],
        editedCell: editedCells[cellId],
        isActive: isActive,
        onUpdate,
        onError,
        onCancel,
        onActivate: onSetActiveCell,
        onDeactivate: onSetActiveCell,
      };
    };

    return (
      <TableRow
        sx={{
          backgroundColor: index % 2 !== 0 ? alpha(theme.palette.action.hover, 0.02) : 'inherit',
        }}
      >
        <TableCell sx={{ border: '1px solid transparent', backgroundColor: 'inherit' }}>
          {row.id}
        </TableCell>

        <DataCell
          {...getCellProps('name')}
          renderEditor={renderTextEditor}
          renderViewer={renderStringViewer}
        />

        <DataCell
          {...getCellProps('status')}
          renderEditor={renderEnumEditor}
          renderViewer={renderStatusViewer}
        />

        <DataCell
          {...getCellProps('count')}
          renderEditor={renderNumberEditor}
          renderViewer={renderNumberViewer}
        />

        <DataCell
          {...getCellProps('price')}
          renderEditor={renderNumberEditor}
          renderViewer={renderPriceViewer}
        />

        <DataCell
          {...getCellProps('created_at')}
          renderEditor={renderDateEditor}
          renderViewer={renderDateViewer}
        />

        <DataCell
          {...getCellProps('updated_at')}
          renderEditor={renderDateEditor}
          renderViewer={renderDateViewer}
        />

        <DataCell
          {...getCellProps('tags')}
          renderEditor={renderTagsEditor}
          renderViewer={renderTagsViewer}
          hideTooltipOnEdit
        />

        <DataCell
          {...getCellProps('metadata')}
          renderEditor={renderJsonEditor}
          renderViewer={renderMetadataViewer}
          hideTooltipOnEdit
        />
      </TableRow>
    );
  },
  (prev, next) => {
    if (prev.index !== next.index) return false;
    if (prev.row !== next.row) return false;

    const prevIsActiveInThisRow = prev.activeCell?.startsWith(`${prev.row.id}_`);
    const nextIsActiveInThisRow = next.activeCell?.startsWith(`${next.row.id}_`);
    if (prevIsActiveInThisRow || nextIsActiveInThisRow) {
      if (prev.activeCell !== next.activeCell) return false;
    }

    const allKeys = Object.keys(prev.row) as (keyof RowData)[];
    for (const key of allKeys) {
      const cellId = getCellId(prev.row.id, key);
      if (prev.editedCells[cellId] !== next.editedCells[cellId]) return false;
    }

    if (prev.onUpdate !== next.onUpdate) return false;
    if (prev.onError !== next.onError) return false;
    if (prev.onCancel !== next.onCancel) return false;
    if (prev.onSetActiveCell !== next.onSetActiveCell) return false;

    return true;
  }
);

export default DataRow;
