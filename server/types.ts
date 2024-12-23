export type Tables = 'users' | 'directories' | 'notes' | 'todos';

export interface NoteInsert {
  user_id: string;
  // full_path: string;
  label: string;
  content?: string;
}
export interface Note extends NoteInsert {
  user_id: string;
  // full_path: string;
  label: string;
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export type TreeItem = {
  label: string;
  id: string;
  created_at: string;
  updated_at?: string;
  type: 'note' | 'directory';
  children?: TreeItem[];
};
export type Tree = TreeItem[];

export interface DirectoryInsert {
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  tree: Tree;
}

export interface Directory extends DirectoryInsert {
  id: string;
}
