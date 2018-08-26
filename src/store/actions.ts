import { UpdatedDirectory } from "@/api/github/diff";
import { SelectedFileState } from "@/store/state";
import * as redux from "redux";

export type Action =
  | FetchTreeAction
  | UpdateTreeAction
  | SelectFileAction
  | UpdateSelectedFileAction;
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

export interface SelectFileAction {
  type: "SELECT_FILE";
  path: string;
}

export function selectFile(path: string): SelectFileAction {
  return {
    type: "SELECT_FILE",
    path
  };
}

export interface UpdateSelectedFileAction {
  type: "UPDATE_SELECTED_FILE";
  state: SelectedFileState;
}

export function updateSelectedFile(
  state: SelectedFileState
): UpdateSelectedFileAction {
  return {
    type: "UPDATE_SELECTED_FILE",
    state
  };
}
