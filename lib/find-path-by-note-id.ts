import { Tree } from '@/server/types';

export function findNoteIdByPath(
  tree: Tree,
  targetPath: string
): string | null {
  const pathParts = targetPath.split('/');

  function findInTree(nodes: Tree, path: string[]): string | null {
    if (path.length === 0) return null;

    const [currentLabel, ...remainingPath] = path;

    for (const node of nodes) {
      if (node.label === currentLabel) {
        if (remainingPath.length === 0) return node.id;
        return findInTree(node?.children!, remainingPath);
      }
    }

    return null; // Path not found
  }

  return findInTree(tree, pathParts);
}
