import Octokit from "@octokit/rest";

export async function loadDiff(
  token: string,
  owner: string,
  repo: string,
  pullRequestId: number
): Promise<UpdatedDirectory> {
  const octokit = new Octokit();
  octokit.authenticate({
    type: "token",
    token
  });
  const pullRequestCommits = (await octokit.pullRequests.getCommits({
    owner,
    repo,
    number: pullRequestId
  })).data;

  // Figure out which commit sha to compare this pull requests to.
  //
  // This is important because, for example, the latest master may include a lot
  // of other changes. We want to make sure we show the code tree as it is in that
  // diff.
  let diffAgainstCommitSha = pullRequestCommits[0].parents![0].sha!;
  let lastCommitSha = pullRequestCommits[0].sha!;
  for (const commit of pullRequestCommits) {
    for (const parentCommit of commit.parents!) {
      if (parentCommit.sha !== lastCommitSha) {
        // This is a merge commit.
        diffAgainstCommitSha = parentCommit.sha;
      }
    }
    lastCommitSha = commit.sha!;
  }

  const diffAgainstTree: {
    tree: GetTreeResponseItem[];
  } = (await octokit.gitdata.getTree({
    owner,
    repo,
    recursive: 1,
    tree_sha: diffAgainstCommitSha
  })).data;
  const originalFiles = makeTree(
    diffAgainstTree.tree.reduce(
      (acc, curr) => {
        if (curr.type === "blob") {
          acc[curr.path] = curr;
        }
        return acc;
      },
      {} as { [path: string]: GetTreeResponseItem }
    )
  );

  const pullRequestFiles = (await octokit.pullRequests.getFiles({
    owner,
    repo,
    number: pullRequestId
  })).data;
  const modifiedFiles = makeTree(
    pullRequestFiles.reduce(
      (acc, curr) => {
        acc[curr.filename] = curr;
        return acc;
      },
      {} as { [path: string]: Octokit.GetFilesResponseItem }
    )
  );

  return buildUpdatedDirectory(originalFiles, modifiedFiles);
}

// This is not provided by Octokit, so we do it instead.
export interface GetTreeResponseItem {
  mode: string;
  path: string;
  sha: string;
  type: "tree" | "blob";
  size?: number;
  url: string;
}

export type OriginalTree = Tree<GetTreeResponseItem>;
export type ModifiedTree = Tree<Octokit.GetFilesResponseItem>;

export interface Tree<Item> {
  [name: string]:
    | { kind: "tree"; tree: Tree<Item> }
    | { kind: "item"; item: Item };
}

function makeTree<Item>(items: { [path: string]: Item }): Tree<Item> {
  const tree: Tree<Item> = {};
  for (const [path, item] of Object.entries(items)) {
    insertKey(tree, path, item);
  }
  return tree;
}

function insertKey<Item>(tree: Tree<Item>, path: string, item: Item) {
  const slashPosition = path.indexOf("/");
  if (slashPosition !== -1) {
    const ancestorName = path.substr(0, slashPosition);
    if (!tree[ancestorName]) {
      tree[ancestorName] = {
        kind: "tree",
        tree: {}
      };
    }
    const treeEntry = tree[ancestorName];
    if (treeEntry.kind !== "tree") {
      throw new Error(`Expected a tree, found ${tree[ancestorName].kind}`);
    }
    insertKey(treeEntry.tree, path.substr(slashPosition + 1), item);
  } else {
    tree[path] = { kind: "item", item };
  }
}

function buildUpdatedDirectory(
  originalFiles: OriginalTree,
  modifiedFiles: ModifiedTree
): UpdatedDirectory {
  const diffEntries: { [entryName: string]: DiffTreeEntry } = {};
  for (const [name, entry] of Object.entries(originalFiles)) {
    const modified = modifiedFiles[name];
    if (modified) {
      // Was it updated or deleted?
      if (entry.kind === "tree" && modified.kind === "tree") {
        diffEntries[name] = buildUpdatedDirectory(entry.tree, modified.tree);
      } else if (entry.kind === "item" && modified.kind === "item") {
        if (modified.item.status === "modified") {
          diffEntries[name] = {
            kind: "updated-file"
          };
        } else if (modified.item.status === "removed") {
          diffEntries[name] = {
            kind: "deleted-file"
          };
        }
        // Note: other statuses are "added" and "renamed".
      }
    } else {
      if (entry.kind === "tree") {
        diffEntries[name] = buildUnchangedDirectory(entry.tree);
      } else {
        diffEntries[name] = {
          kind: "unchanged-file"
        };
      }
    }
  }
  for (const [name, entry] of Object.entries(modifiedFiles)) {
    if (!originalFiles[name]) {
      // This is new.
      if (entry.kind === "tree") {
        diffEntries[name] = buildAddedDirectory(entry.tree);
      } else {
        diffEntries[name] = {
          kind: "added-file"
        };
      }
    }
  }
  return {
    kind: "updated-dir",
    entries: diffEntries
  };
}

function buildAddedDirectory(modifiedFiles: ModifiedTree): AddedDirectory {
  const addedEntries: { [entryName: string]: AddedFile | AddedDirectory } = {};
  for (const [name, entry] of Object.entries(modifiedFiles)) {
    if (entry.kind === "tree") {
      addedEntries[name] = buildAddedDirectory(entry.tree);
    } else {
      addedEntries[name] = {
        kind: "added-file"
      };
    }
  }
  return {
    kind: "added-dir",
    entries: addedEntries
  };
}

function buildUnchangedDirectory(
  originalFiles: OriginalTree
): UnchangedDirectory {
  const existingEntries: {
    [entryName: string]: UnchangedFile | UnchangedDirectory;
  } = {};
  for (const [name, entry] of Object.entries(originalFiles)) {
    if (entry.kind === "tree") {
      existingEntries[name] = buildUnchangedDirectory(entry.tree);
    } else {
      existingEntries[name] = {
        kind: "unchanged-file"
      };
    }
  }
  return {
    kind: "unchanged-dir",
    entries: existingEntries
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
}

export interface DeletedFile {
  kind: "deleted-file";
}

export interface UpdatedFile {
  kind: "updated-file";
}

export interface UnchangedFile {
  kind: "unchanged-file";
}

export interface AddedDirectory {
  kind: "added-dir";
  entries: { [entryName: string]: AddedFile | AddedDirectory };
}

export interface DeletedDirectory {
  kind: "deleted-dir";
  oldId: string;
}

export interface UpdatedDirectory {
  kind: "updated-dir";
  entries: { [entryName: string]: DiffTreeEntry };
}

export interface UnchangedDirectory {
  kind: "unchanged-dir";
  entries: { [entryName: string]: UnchangedFile | UnchangedDirectory };
}
