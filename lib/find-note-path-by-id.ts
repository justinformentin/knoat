import { Tree } from '@/server/types';

export function findPathById(
  data: Tree,
  targetId: string,
  path = ''
): string | null {
  if (!data || !data.length) return '';
  for (const item of data) {
    const currentPath = path ? `${path}/${item.label}` : item.label;

    if (item.id === targetId) return currentPath;

    if (item.children) {
      const result = findPathById(item.children, targetId, currentPath);
      if (result) return result;
    }
  }
  return null; // Return null if the targetId is not found
}
