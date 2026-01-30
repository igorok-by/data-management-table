import { RowStatus } from '@/types';
import type { RowData, RowStatusValue } from '@/types';

export const generateMockData = (): RowData[] => {
  const statuses: RowStatusValue[] = [RowStatus.ACTIVE, RowStatus.INACTIVE, RowStatus.DRAFT];
  const data: RowData[] = [];

  for (let i = 1; i <= 20; i++) {
    data.push({
      id: `row_${String(i).padStart(3, '0')}`,
      name: `Entity ${i}`,
      status: statuses[i % 3],
      count: i % 3 === 0 ? null : i * 10,
      price: i % 4 === 0 ? null : parseFloat((i * 19.99).toFixed(2)),
      created_at: new Date(2024, 0, i, 10, 30, 0).toISOString(),
      updated_at: i % 2 === 0 ? new Date(2024, 0, i, 12, 0, 0).toISOString() : null,
      tags: i % 2 === 0 ? ['alpha', 'release'] : ['beta'],
      metadata: {
        owner: `user_${100 + i}`,
        priority: i % 5,
        flags: {
          archived: false,
          visible: true,
        },
        extra: i % 3 === 0 ? { info: 'nested data' } : undefined,
      },
    });
  }

  return data;
};
