import { Tree } from "@/api/models";
import fetchRepositoryRootTree from "./graphql/repositoryroottree";

export async function loadRepository(
  token: string,
  owner: string,
  repository: string,
  branch: string
) {
  let result = await fetchRepositoryRootTree(token, owner, repository, branch);
  let tree: Tree = {};
  for (let entry of result.repository.ref.target.tree.entries) {
    if (entry.type === "tree") {
      tree[entry.name] = {
        type: "tree"
      };
    } else if (entry.type === "blob") {
      tree[entry.name] = {
        type: "file"
      };
    } else {
      throw new Error(`Unknown entry type: ${entry.type}.`);
    }
  }
  return tree;
}

// export async function loadNode(
//   token: string,
//   id: string
// ): Promise<Tree | string | null> {
//   let content = await fetchContent(token, id);
//   switch (content.node.__typename) {
//     case "Tree":
//       let tree: Tree = {};
//       for (let entry of content.node.entries) {
//         if (entry.type === "tree") {
//           tree[entry.name] = {
//             type: "tree"
//           };
//         } else if (entry.type === "blob") {
//           tree[entry.name] = {
//             type: "file"
//           };
//         } else {
//           throw new Error(`Unknown entry type: ${entry.type}.`);
//         }
//       }
//       return tree;
//     case "Blob":
//       return content.node.text;
//     default:
//       throw new Error(`Unknown node type: ${content.node.__typename}.`);
//   }
// }
