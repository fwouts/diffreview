import fetchContent from "@/api/github/graphql/content";
import fetchRepositoryRootTree from "./graphql/repositoryroottree";

export async function loadRepository(
  token: string,
  owner: string,
  repository: string,
  branch: string
): Promise<NodeId> {
  const result = await fetchRepositoryRootTree(
    token,
    owner,
    repository,
    branch
  );
  return result.repository.ref.target.tree.id;
}

export async function loadNode(
  token: string,
  id: string
): Promise<Directory | File> {
  const content = await fetchContent(token, id);
  switch (content.node.__typename) {
    case "Tree":
      const loadedDirectory: Directory = {
        kind: "dir",
        entries: {}
      };
      for (const entry of content.node.entries) {
        // TODO: Handle other types.
        const type = entry.type === "blob" ? "file" : "dir";
        loadedDirectory.entries[entry.name] = {
          type,
          id: entry.object.id
        };
      }
      return loadedDirectory;
    case "Blob":
      return {
        kind: "file",
        content: content.node.text
      };
    default:
      throw new Error(`Unknown node type: ${content.node.__typename}.`);
  }
}

export type NodeId = string;

export interface Directory {
  kind: "dir";
  entries: {
    [entryName: string]: {
      type: "dir" | "file";
      id: NodeId;
    };
  };
}

export interface File {
  kind: "file";
  content: string;
}
