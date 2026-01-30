import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import type { EditorProps } from '@/components/DataCell';

const JsonEditor = ({
  value,
  onChange,
  onCommit,
  onCancel,
  onError: _onParentError,
}: EditorProps) => {
  const [jsonString, setJsonString] = useState(() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return '{}';
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonString);

      onChange(parsed);
      setError(null);
      _onParentError(null);
      onCommit();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';

      onChange(jsonString);
      setError(msg);
      _onParentError(msg);
    }
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit JSON</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          multiline
          minRows={4}
          maxRows={15}
          fullWidth
          variant="outlined"
          value={jsonString}
          onChange={(e) => {
            setJsonString(e.target.value);
            setError(null);
            _onParentError(null);
          }}
          sx={{ fontFamily: 'monospace', mt: 1 }}
          slotProps={{
            htmlInput: {
              style: { fontFamily: 'monospace' },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JsonEditor;
