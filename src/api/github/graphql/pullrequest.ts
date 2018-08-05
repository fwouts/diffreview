import { fetch } from "@/api/github/graphql/common";

export interface PullRequest {
  repository: {
    pullRequest: {
      baseRefName: string;
      headRefName: string;
    };
  };
}

export default async function fetchPullRequest(
  token: string,
  owner: string,
  repository: string,
  pullRequestId: number
): Promise<PullRequest> {
  return fetch<PullRequest>(
    token,
    `query {
  repository(owner: "${owner}", name: "${repository}") {
    pullRequest(number: ${pullRequestId}) {
      baseRefName
      headRefName
    }
  }
}`
  );
}
