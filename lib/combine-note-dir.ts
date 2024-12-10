import {
  Directory,
  GeneratedDir,
  Note,
  TreeViewDirectory,
} from '@/server/types';
// type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };

type Item = Note | GeneratedDir;

type AddNoteArgs = {
  tree: TreeViewDirectory;
  item: Item;
  segments: string[];
};
export function combineDirectoriesAndNotes(
  notes: Note[] | null,
  directories: Directory[]
) {
  const root: TreeViewDirectory = [];

  function addNode({ tree, item, segments }: AddNoteArgs) {
    const [current, ...rest] = segments;

    // Find or create the current node
    let node = tree.find((n) => n.label === current);
    if (!node) {
      node = { ...item, label: current };
      // @ts-ignore Type error will be fixed when changing the note/dir error
      if (!node.content && !node.children) node.children = [];
      tree.push(node);
    }

    // If there are more segments, recurse into children
    // @ts-ignore Type error will be fixed when changing the note/dir error
    if (rest.length > 0) addNode({ tree: node.children, item, segments: rest });
  }

  const initialItem = (item: Directory | Note) =>
    addNode({ tree: root, item, segments: item.full_path.split('/') });
  // Add directories and notes to the unified tree
  directories.forEach(initialItem);
  notes?.forEach(initialItem);

  return root;
}
