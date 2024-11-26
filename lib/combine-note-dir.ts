import { Directory, Note } from "@/server/types";
type TreeViewDirectory = Directory & { children?: Directory[] | Note[] };

export   const combineDirectoriesAndNotes = (
    notes: Note[] | null,
    directories: Directory[] | null,
  ) => {
    const treeView: TreeViewDirectory[] = [...directories!];
    const findDir = (fullPath: string) => {
      const path = fullPath.split('/').slice(0, -1).join('/');
      if (path === '') return;
      return treeView?.find((d) => d.full_path === path);
    };

    notes?.forEach((n) => {
      const foundDir = findDir(n.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        foundDir.children.push(n);
      }
    });

    treeView?.forEach((d) => {
      if (!d.children) d.children = [];

      const foundDir = findDir(d.full_path);
      if (foundDir) {
        if (!foundDir.children) foundDir.children = [];
        // @ts-ignore
        foundDir.children.push(d);
        const currIdx = treeView.findIndex((dd) => dd.id === d.id);
        if (currIdx !== -1) treeView.splice(currIdx, 1);
      }
    });
    return directories;
  };