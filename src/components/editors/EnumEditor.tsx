import React from 'react';
import { Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { RowStatus } from '@/types';
import type { EditorProps } from '@/components/DataCell';

const EnumEditor = ({ value, onChange, onCommit, onCancel, onError, autoFocus }: EditorProps) => {
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    onChange(e.target.value as string);
    onError(null);
    setTimeout(onCommit, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    }

    if (e.key === 'Enter') {
      e.stopPropagation();
      onCommit();
    }
  };

  return (
    <Select
      value={value as string}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoFocus={autoFocus}
      variant="standard"
      fullWidth
      defaultOpen
      disableUnderline
      sx={{
        margin: 0,
        fontSize: 'inherit',
        '& .MuiSelect-select': {
          padding: 0,
          margin: 0,
          lineHeight: 'normal',
        },
      }}
    >
      <MenuItem value={RowStatus.ACTIVE}>Active</MenuItem>
      <MenuItem value={RowStatus.INACTIVE}>Inactive</MenuItem>
      <MenuItem value={RowStatus.DRAFT}>Draft</MenuItem>
    </Select>
  );
};

export default EnumEditor;
