import {
  Box,
  Button,
  Typography,
  CssBaseline,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DataTable from '@/components/DataTable';
import { useTableState } from '@/hooks/useTableState';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const {
    data,
    loading,
    saving,
    editedCells,
    activeCell,
    isDirty,
    hasErrors,
    handleCellUpdate,
    handleCellError,
    handleCancelEdit,
    handleSetActiveCell,
    handleSave,
  } = useTableState();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
          onClick={() => handleSetActiveCell(null)}
        >
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Data Management
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {saving && <CircularProgress size={24} />}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isDirty || hasErrors || saving}
                  onClick={handleSave}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, p: 2, overflow: 'hidden' }}>
            <DataTable
              data={data}
              loading={loading}
              editedCells={editedCells}
              activeCell={activeCell}
              onCellUpdate={handleCellUpdate}
              onCellError={handleCellError}
              onCancelEdit={handleCancelEdit}
              onSetActiveCell={handleSetActiveCell}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
