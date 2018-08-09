import { Action } from "@/store/actions";
import { RepoState } from "@/store/state";
import * as config from "../config";

export default (
  state: RepoState = {
    repoOwner: config.OWNER,
    repoName: config.REPO,
    pullRequestId: config.PULL_REQUEST_ID,
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
    default:
      return state;
  }
};
