import { UpdatedDirectory } from "@/api/github/diff";

export interface RepoState {
  repoOwner: string;
  repoName: string;
  oldBranch: string;
  newBranch: string;
  tree: UpdatedDirectory | null;
}
