export interface Tree {
  [entryName: string]: SubTreeEntry | FileEntry;
}

export interface SubTreeEntry {
  type: "tree";
  id: string;
  expanded: boolean;
  content?: Tree;
}

export interface FileEntry {
  type: "file";
  id: string;
  content?: string;
}
