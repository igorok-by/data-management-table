import { useState, useCallback, useEffect, useRef } from 'react';
import type { RowData, TableData, CellValue } from '@/types';
import { fetchData, saveData } from '@/services/api';

export type CellId = string;

export interface EditedCell {
  value: CellValue;
  error?: string;
}

export const getCellId = (rowId: string, colKey: string) => `${rowId}_${colKey}`;

export const useTableState = () => {
  const [data, setData] = useState<TableData>([]);
  const [editedCells, setEditedCells] = useState<Record<CellId, EditedCell>>({});
  const [activeCell, setActiveCell] = useState<CellId | null>(null);
  const [activeCellCheckpoint, setActiveCellCheckpoint] = useState<{
    value: CellValue;
    wasDirty: boolean;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dataRef = useRef(data);
  const editedCellsRef = useRef(editedCells);
  const checkpointRef = useRef(activeCellCheckpoint);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  useEffect(() => {
    editedCellsRef.current = editedCells;
  }, [editedCells]);
  useEffect(() => {
    checkpointRef.current = activeCellCheckpoint;
  }, [activeCellCheckpoint]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const result = await fetchData();

        setData(result);
        setEditedCells({});
        setActiveCell(null);
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSetActiveCell = useCallback((cellId: CellId | null) => {
    setActiveCell(cellId);

    if (cellId) {
      const [rowId, colKey] = cellId.split('_');
      const row = dataRef.current.find((r: RowData) => r.id === rowId);
      const originalValue = row ? row[colKey as keyof RowData] : undefined;
      const editedEntry = editedCellsRef.current[cellId];

      setActiveCellCheckpoint({
        value: editedEntry ? editedEntry.value : originalValue,
        wasDirty: !!editedEntry,
        error: editedEntry?.error,
      });
    } else {
      setActiveCellCheckpoint(null);
    }
  }, []);

  const handleCellUpdate = useCallback(
    (rowId: string, columnKey: keyof RowData, newValue: CellValue) => {
      setEditedCells((prev) => ({
        ...prev,
        [getCellId(rowId, columnKey as string)]: { value: newValue },
      }));
    },
    []
  );

  const handleCellError = useCallback((rowId: string, columnKey: keyof RowData, error?: string) => {
    setEditedCells((prev) => {
      const cellId = getCellId(rowId, columnKey);
      const current = prev[cellId] || { value: undefined };

      if (error) {
        return { ...prev, [cellId]: { ...current, error } };
      } else {
        const newCellState = { ...current };

        delete newCellState.error;

        return { ...prev, [cellId]: newCellState };
      }
    });
  }, []);

  const handleCancelEdit = useCallback((rowId: string, columnKey: keyof RowData) => {
    const cellId = getCellId(rowId, columnKey as string);
    const checkpoint = checkpointRef.current;

    if (checkpoint) {
      if (checkpoint.wasDirty) {
        setEditedCells((prev) => ({
          ...prev,
          [cellId]: {
            value: checkpoint.value,
            error: checkpoint.error,
          },
        }));
      } else {
        setEditedCells((prev) => {
          const newMap = { ...prev };

          delete newMap[cellId];

          return newMap;
        });
      }
    }

    setActiveCell(null);
    setActiveCellCheckpoint(null);
  }, []);

  const handleSave = useCallback(async () => {
    const payload = dataRef.current.map((row: RowData) => {
      const updatedRow = { ...row };

      Object.keys(row).forEach((key) => {
        const cellId = getCellId(row.id, key);
        const edits = editedCellsRef.current[cellId];

        if (edits && edits.error === undefined) {
          (updatedRow as Record<string, CellValue>)[key] = edits.value;
        }
      });

      return updatedRow;
    });

    setSaving(true);

    try {
      await saveData(payload);

      setEditedCells({});
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaving(false);
    }
  }, []);

  const isDirty = Object.keys(editedCells).length > 0;
  const hasErrors = Object.values(editedCells).some((cell) => !!cell.error);

  return {
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
  };
};
