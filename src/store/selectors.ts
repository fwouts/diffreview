import { FileEntry, SubTreeEntry, Tree } from "@/api/models";
import { RepoState } from "@/store/state";
import { createSelector } from "reselect";

export const getTree = createSelector(
  (state: RepoState) => ({
    leftBranch: state.leftBranch.data,
    rightBranch: state.rightBranch.data
  }),
  ({ leftBranch, rightBranch }) => {
    const leftTree = leftBranch.kind === "loaded" ? leftBranch.tree : null;
    const rightTree = rightBranch.kind === "loaded" ? rightBranch.tree : null;
    return mergePotentialTrees(leftTree, rightTree);
  }
);

function mergePotentialTrees(tree: Tree | null, otherTree: Tree | null) {
  if (tree === null || otherTree === null) {
    if (tree) {
      return tree;
    } else {
      return otherTree;
    }
  }
  return mergeTrees(tree, otherTree);
}

function mergeTrees(tree: Tree, otherTree: Tree) {
  return Object.entries(tree)
    .concat(Object.entries(otherTree))
    .reduce((acc: Tree, [key, value]) => {
      if (!acc[key]) {
        acc[key] = value;
      } else {
        acc[key] = mergeEntries(acc[key], value);
      }
      return acc;
    }, {});
}

function mergeEntries(
  entry: SubTreeEntry | FileEntry,
  otherEntry: SubTreeEntry | FileEntry
): SubTreeEntry | FileEntry {
  if (entry.type === "tree" && otherEntry.type === "tree") {
    if (!entry.content || !otherEntry.content) {
      if (entry.content) {
        return entry;
      } else {
        return otherEntry;
      }
    }
    return {
      type: "tree",
      content: mergeTrees(entry.content, otherEntry.content)
    };
  } else if (entry.type === "file" && otherEntry.type === "file") {
    return entry;
  } else {
    // Fall back to one of the two.
    // TODO: Use a smarter approach.
    return entry;
  }
}
