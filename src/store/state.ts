import { Tree } from "@/api/models";

export interface RepoState {
  repoOwner: string;
  repoName: string;
  leftBranch: BranchState;
  rightBranch: BranchState;
}

export interface BranchState {
  name: string;
  data: BranchData;
}

export type BranchData =
  | UnloadedBranchData
  | LoadingBranchData
  | LoadedBranchData
  | FailedLoadingBranchData;

export interface UnloadedBranchData {
  kind: "unloaded";
}

export interface LoadingBranchData {
  kind: "loading";
}

export interface LoadedBranchData {
  kind: "loaded";
  tree: Tree;
}

export interface FailedLoadingBranchData {
  kind: "failed";
  error: any;
}
