import { fetch } from "@/api/github/graphql/common";

export interface Content {
  node:
    | {
        __typename: "Blob";
        text: string;
      }
    | {
        __typename: "Tree";
        entries: Array<{
          name: string;
          type: "blob" | "tree" | string;
          object: {
            id: string;
          };
        }>;
      }
    | {
        // Could also be another than "unknown". Used for convenience in switch statements.
        __typename: "unknown";
      };
}

export default async function fetchContent(
  token: string,
  id: string
): Promise<Content> {
  return fetch<Content>(
    token,
    `query {
  node(id: "${id}") {
    __typename
    ... on Blob {
      text
    }
    ... on Tree {
      entries {
        name
        type
        object {
          id
        }
      }
    }
  }
}`
  );
}
