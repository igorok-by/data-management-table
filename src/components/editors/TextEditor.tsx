import React, { useState } from 'react';
import { TextField } from '@mui/material';
import type { EditorProps } from '@/components/DataCell';

interface TextEditorProps extends EditorProps {
  type?: 'string' | 'number';
}

const TextEditor = ({
  value,
  onChange,
  onCommit,
  onCancel,
  onError,
  autoFocus,
  type = 'string',
}: TextEditorProps) => {
  const [localValue, setLocalValue] = useState(String(value ?? ''));

  const validate = (val: string): string | null => {
    const trimmed = val.trim();

    if (type === 'number' && trimmed === '') return null;

    if (trimmed === '') return 'Value cannot be empty';

    if (type === 'number') {
      const num = Number(val);

      if (isNaN(num)) return 'Must be a valid number';
    }

    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();

      const errorMsg = validate(localValue);

      if (errorMsg) {
        onError(errorMsg);
      } else {
        onError(null);
        setTimeout(onCommit, 0);
      }
    }

    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    setLocalValue(newVal);

    let syncValue: string | number | null = newVal;

    if (type === 'number') {
      if (newVal.trim() === '') {
        syncValue = null;
      }

      if (!isNaN(Number(newVal))) {
        syncValue = Number(newVal);
      }
    }

    onChange(syncValue);
    onError(null);
  };

  const handleBlur = () => {
    const errorMsg = validate(localValue);

    if (errorMsg) {
      onError(errorMsg);
    }
  };

  return (
    <TextField
      fullWidth
      variant="standard"
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      autoFocus={autoFocus}
      slotProps={{
        input: {
          disableUnderline: true,
        },
      }}
      sx={{
        margin: 0,
        '& .MuiInputBase-root': {
          fontSize: 'inherit',
          padding: 0,
          margin: 0,
          lineHeight: 'normal',
        },
        '& .MuiInputBase-input': {
          padding: 0,
          margin: 0,
          height: 'auto',
        },
      }}
    />
  );
};

export default TextEditor;
