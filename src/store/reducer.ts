import { Action } from "@/store/actions";
import { RepoState } from "@/store/state";
import * as config from "../config";

export default (
  state: RepoState = {
    repoOwner: config.OWNER,
    repoName: config.REPO,
    pullRequestId: config.PULL_REQUEST_ID,
    tree: null,
    selectedFile: null
  },
  action: Action
): RepoState => {
  switch (action.type) {
    case "UPDATE_TREE":
      return {
        ...state,
        tree: action.tree
      };
    case "UPDATE_SELECTED_FILE":
      return {
        ...state,
        selectedFile: action.state
      };
    default:
      return state;
  }
};
