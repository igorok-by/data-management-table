import type { RowData } from '@/types';
import { generateMockData } from '@/services/mockData';

const DELAY_MS = 1000;

export const fetchData = (): Promise<RowData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockData());
    }, DELAY_MS);
  });
};

export const saveData = (data: RowData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Saving data to backend:', data);

      if (!data) {
        reject(new Error('No data provided'));
        return;
      }

      resolve();
    }, DELAY_MS);
  });
};
