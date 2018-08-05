import { fetch } from "@/api/github/graphql/common";

export interface RepositoryRootTree {
  repository: {
    ref: {
      target: {
        tree: {
          id: string;
        };
      };
    };
  };
}

export default async function fetchRepositoryRootTree(
  token: string,
  owner: string,
  repository: string,
  branch: string
): Promise<RepositoryRootTree> {
  return fetch<RepositoryRootTree>(
    token,
    `query {
  repository(owner: "${owner}", name: "${repository}") {
    ref(qualifiedName: "${branch}") {
      target {
        ... on Commit {
          tree {
            id
          }
        }
      }
    }
  }
}`
  );
}
