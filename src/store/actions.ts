import { UpdatedDirectory } from "@/api/github/diff";
import * as redux from "redux";

export type Action = FetchTreeAction | UpdateTreeAction;
export type Dispatch = redux.Dispatch<Action>;

export type BranchSide = "left" | "right";

export interface FetchTreeAction {
  type: "FETCH_TREE";
}

export function fetchTree(): FetchTreeAction {
  return {
    type: "FETCH_TREE"
  };
}

export interface UpdateTreeAction {
  type: "UPDATE_TREE";
  tree: UpdatedDirectory | null;
}

export function updateTree(tree: UpdatedDirectory | null): UpdateTreeAction {
  return {
    type: "UPDATE_TREE",
    tree
  };
}
