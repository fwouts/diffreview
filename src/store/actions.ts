import { UpdatedDirectory } from "@/api/github/diff";
import { SelectedFileState } from "@/store/state";
import * as redux from "redux";

export type Action =
  | FetchTreeWithFileAction
  | FetchTreeAction
  | UpdateTreeAction
  | SelectFileAction
  | UpdateSelectedFileAction;
export type Dispatch = redux.Dispatch<Action>;

export type BranchSide = "left" | "right";

export interface FetchTreeWithFileAction {
  type: "FETCH_TREE_WITH_FILE";
  owner: string;
  repo: string;
  pullRequestNumber: number;
  path: string | null;
}

export function fetchTreeWithFile(
  owner: string,
  repo: string,
  pullRequestNumber: number,
  path: string | null
): FetchTreeWithFileAction {
  return {
    type: "FETCH_TREE_WITH_FILE",
    owner,
    repo,
    pullRequestNumber,
    path
  };
}

export interface FetchTreeAction {
  type: "FETCH_TREE";
  owner: string;
  repo: string;
  pullRequestNumber: number;
}

export function fetchTree(
  owner: string,
  repo: string,
  pullRequestNumber: number
): FetchTreeAction {
  return {
    type: "FETCH_TREE",
    owner,
    repo,
    pullRequestNumber
  };
}

export interface UpdateTreeAction {
  type: "UPDATE_TREE";
  owner: string;
  repo: string;
  pullRequestNumber: number;
  tree: UpdatedDirectory | null;
}

export function updateTree(
  owner: string,
  repo: string,
  pullRequestNumber: number,
  tree: UpdatedDirectory | null
): UpdateTreeAction {
  return {
    type: "UPDATE_TREE",
    owner,
    repo,
    pullRequestNumber,
    tree
  };
}

export interface SelectFileAction {
  type: "NAVIGATE_TO_FILE";
  path: string;
}

export function selectFile(path: string): SelectFileAction {
  return {
    type: "NAVIGATE_TO_FILE",
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
