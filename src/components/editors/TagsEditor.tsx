import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import type { EditorProps } from '@/components/DataCell';

const TagsEditor = ({ value, onChange, onCommit, onCancel, onError }: EditorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const tags: string[] = Array.isArray(value) ? value : [];

  const handleDelete = (tagToDelete: string) => {
    onChange(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAdd = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) return;

    if (tags.includes(trimmed)) {
      const msg = 'Tag already exists';

      setError(msg);
      onError(msg);

      return;
    }

    onChange([...tags, trimmed]);
    setInputValue('');
    setError(null);
    onError(null);
  };

  const handleApply = () => {
    const trimmed = inputValue.trim();

    if (trimmed) {
      if (tags.includes(trimmed)) {
        const msg = 'Tag already exists';

        setError(msg);
        onError(msg);

        return;
      }

      onChange([...tags, trimmed]);
      setInputValue('');
    }

    if (error) return;

    onError(null);
    onCommit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();

      if (inputValue.trim()) {
        handleAdd();
      } else {
        handleApply();
      }
    }

    if (e.key === 'Escape') {
      e.stopPropagation();
      setInputValue('');
    }
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit Tags</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 1 }}>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" onDelete={() => handleDelete(tag)} />
          ))}
        </Box>
        <TextField
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
            onError(null);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          fullWidth
          variant="outlined"
          placeholder="Add tag and press Enter"
          label="New Tag"
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagsEditor;
