import { loadNode, loadRepository } from "@/api/github/loader";

export async function loadDiff(
  token: string,
  owner: string,
  repository: string,
  leftBranch: string,
  rightBranch: string
): Promise<UpdatedDirectory> {
  const oldTreeId = await loadRepository(token, owner, repository, leftBranch);
  const newTreeId = await loadRepository(token, owner, repository, rightBranch);
  return loadUpdatedDirectory(token, oldTreeId, newTreeId);
}

async function loadUpdatedDirectory(
  token: string,
  oldId: string,
  newId: string
): Promise<UpdatedDirectory> {
  console.log(`Loading nodes ${oldId} and ${newId}...`);
  const oldNode = await loadNode(token, oldId);
  const newNode = await loadNode(token, newId);
  if (oldNode.kind !== "dir" || newNode.kind !== "dir") {
    throw new Error();
  }
  const updatedDirectory: UpdatedDirectory = {
    kind: "updated-dir",
    oldId,
    newId,
    entries: {}
  };
  for (const [entryName, newEntry] of Object.entries(newNode.entries)) {
    const oldEntry = oldNode.entries[entryName];
    if (!oldEntry) {
      // New file or directory.
      if (newEntry.type === "file") {
        updatedDirectory.entries[entryName] = {
          kind: "added-file",
          newId: newEntry.id
        };
      } else {
        console.log("Loading from updated: directory " + entryName);
        updatedDirectory.entries[entryName] = await loadAddedDirectory(
          token,
          newEntry.id
        );
      }
    } else if (oldEntry.id === newEntry.id) {
      // Unchanged file or directory.
      if (oldEntry.type === "file") {
        updatedDirectory.entries[entryName] = {
          kind: "unchanged-file",
          id: oldEntry.id
        };
      } else {
        updatedDirectory.entries[entryName] = {
          kind: "unchanged-dir",
          id: oldEntry.id
        };
      }
    } else {
      // Updated file or directory.
      if (oldEntry.type !== newEntry.type) {
        // TODO: Handle this.
      }
      if (oldEntry.type === "file") {
        updatedDirectory.entries[entryName] = {
          kind: "updated-file",
          oldId: oldEntry.id,
          newId: newEntry.id
        };
      } else {
        updatedDirectory.entries[entryName] = await loadUpdatedDirectory(
          token,
          oldEntry.id,
          newEntry.id
        );
      }
    }
  }
  for (const [entryName, oldEntry] of Object.entries(oldNode.entries)) {
    if (!newNode.entries[entryName]) {
      // Deleted file or directory.
      if (oldEntry.type === "file") {
        updatedDirectory.entries[entryName] = {
          kind: "deleted-file",
          oldId: oldEntry.id
        };
      } else {
        updatedDirectory.entries[entryName] = {
          kind: "deleted-dir",
          oldId: oldEntry.id
        };
      }
    }
  }
  return updatedDirectory;
}

async function loadAddedDirectory(
  token: string,
  directoryId: string
): Promise<AddedDirectory> {
  const directory = await loadNode(token, directoryId);
  if (directory.kind !== "dir") {
    throw new Error();
  }
  const entries = Object.entries(directory.entries).map(
    async ([entryName, entry]): Promise<
      [string, AddedFile | AddedDirectory]
    > => {
      if (entry.type === "file") {
        return [
          entryName,
          {
            kind: "added-file",
            newId: entry.id
          }
        ];
      } else {
        console.log("Loading from added: directory " + entryName);
        return [entryName, await loadAddedDirectory(token, entry.id)];
      }
    }
  );
  return {
    kind: "added-dir",
    newId: directoryId,
    entries: (await Promise.all(entries)).reduce(
      (
        acc: { [entryName: string]: AddedFile | AddedDirectory },
        [entryName, entry]
      ) => {
        acc[entryName] = entry;
        return acc;
      },
      {}
    )
  };
}

export type DiffTreeEntry =
  | AddedFile
  | AddedDirectory
  | DeletedFile
  | DeletedDirectory
  | UpdatedFile
  | UpdatedDirectory
  | UnchangedFile
  | UnchangedDirectory;

export interface AddedFile {
  kind: "added-file";
  newId: string;
}

export interface DeletedFile {
  kind: "deleted-file";
  oldId: string;
}

export interface UpdatedFile {
  kind: "updated-file";
  oldId: string;
  newId: string;
}

export interface UnchangedFile {
  kind: "unchanged-file";
  id: string;
}

export interface AddedDirectory {
  kind: "added-dir";
  newId: string;
  entries: { [entryName: string]: AddedFile | AddedDirectory };
}

export interface DeletedDirectory {
  kind: "deleted-dir";
  oldId: string;
}

export interface UpdatedDirectory {
  kind: "updated-dir";
  oldId: string;
  newId: string;
  entries: { [entryName: string]: DiffTreeEntry };
}

export interface UnchangedDirectory {
  kind: "unchanged-dir";
  id: string;
}
