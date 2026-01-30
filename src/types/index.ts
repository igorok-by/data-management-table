export const RowStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

export type RowStatusValue = (typeof RowStatus)[keyof typeof RowStatus];

export interface RowMetadata {
  owner: string;
  priority: number;
  flags: {
    archived: boolean;
    visible: boolean;
  };
  [key: string]: unknown;
}

export interface RowData {
  id: string;
  name: string;
  status: RowStatusValue;
  count: number | null;
  price: number | null;
  created_at: string | null;
  updated_at: string | null;
  tags: string[];
  metadata: RowMetadata;
}

export type TableData = RowData[];

export type CellValue = string | number | boolean | null | undefined | string[] | RowMetadata;
