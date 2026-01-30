import React, { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { EditorProps } from '@/components/DataCell';

const DateEditor = ({ value, onChange, onCommit, onCancel, onError, autoFocus }: EditorProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue?.isValid()) {
      onChange(newValue.toISOString());
      onError(null);
    } else {
      onChange(null);
      onError('Invalid date');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onCommit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!value) {
        onError('Date cannot be empty');
      } else {
        onCommit();
      }
    }

    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <DateTimePicker
      value={value ? dayjs(value as string) : null}
      onChange={handleChange}
      open={isOpen}
      onClose={handleClose}
      onOpen={() => setIsOpen(true)}
      format="YYYY-MM-DD HH:mm"
      ampm={false}
      slotProps={{
        textField: {
          variant: 'standard',
          fullWidth: true,
          autoFocus,
          onKeyDown: handleKeyDown,
          InputProps: { disableUnderline: true },
        },
      }}
      sx={{
        '& .MuiInputBase-root': {
          padding: '0 8px',
        },
      }}
    />
  );
};

export default DateEditor;
