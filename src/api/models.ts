export interface Tree {
  [entryName: string]: SubTreeEntry | FileEntry;
}

export interface SubTreeEntry {
  type: "tree";
  content?: Tree;
}

export interface FileEntry {
  type: "file";
}
