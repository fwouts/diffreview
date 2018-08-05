import { Action } from "@/store/actions";
import { RepoState } from "@/store/state";
import * as config from "../config";

export default (
  state: RepoState = {
    repoOwner: config.OWNER,
    repoName: config.REPO,
    oldBranch: config.OLD_BRANCH,
    newBranch: config.NEW_BRANCH,
    tree: null
  },
  action: Action
): RepoState => {
  switch (action.type) {
    case "UPDATE_TREE":
      return {
        ...state,
        tree: action.tree
      };
  }
  console.warn(`Unhandled action: ${action.type}.`);
  return state;
};
