import { Action } from "@/store/actions";
import { RepoState } from "@/store/state";

export default (
  state: RepoState = {
    owner: null,
    repo: null,
    pullRequestNumber: null,
    tree: null,
    selectedFile: null
  },
  action: Action
): RepoState => {
  switch (action.type) {
    case "UPDATE_TREE":
      return {
        ...state,
        owner: action.owner,
        repo: action.repo,
        pullRequestNumber: action.pullRequestNumber,
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
