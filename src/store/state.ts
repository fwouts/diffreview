import { UpdatedDirectory } from "@/api/github/diff";

// TODO: Remove | null and wrap into a higher-level state.
export interface RepoState {
  owner: string | null;
  repo: string | null;
  pullRequestNumber: number | null;
  tree: UpdatedDirectory | null;
  selectedFile: SelectedFileState | null;
}

export type SelectedFileState =
  | SelectedFileLoading
  | SelectedFileLoaded
  | SelectedFileFailed;

export interface SelectedFileLoading {
  kind: "loading";
  path: string;
}

export interface SelectedFileLoaded {
  kind: "loaded";
  path: string;
  before: string | null;
  after: string | null;
}

export interface SelectedFileFailed {
  kind: "failed";
  path: string;
}
