import type {MutableRefObject} from 'react';

export interface TreeItem {
  id: string;
  children: TreeItem[];
  collapsed?: boolean;
  label: string;
  type: 'note' | 'directory'
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: string | null;
  label: string;
  depth: number;
  index: number;
  type: 'note' | 'directory'
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
