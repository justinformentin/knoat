export type Tables = 'users' | 'directories' | 'notes';

export interface NoteInsert {
  user_id: string;
  full_path: string;
  label: string;
}
export interface Note extends NoteInsert {
  user_id: string;
  full_path: string;
  label: string;
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DirectoryInsert {
  user_id: string;
  full_path: string;
  label: string;
  created_at: string;
  updated_at?: string;

}
export interface Directory extends DirectoryInsert {
  id: string;
}

// export type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };
export type GeneratedDir = Directory & {children?: GeneratedDir[] | Note[] };
// export type TreeViewDirectory = GeneratedDir & { children?: GeneratedDir[] | Note[] };
export type TreeViewDirectory = Array<Note | GeneratedDir>;