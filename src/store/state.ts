import { UpdatedDirectory } from "@/api/github/diff";

export interface RepoState {
  repoOwner: string;
  repoName: string;
  pullRequestId: number;
  tree: UpdatedDirectory | null;
}
