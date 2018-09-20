import { Action } from "@/store/actions";
import { AppState } from "@/store/state";

export default (
  state: AppState = {
    repo: null
  },
  action: Action
): AppState => {
  switch (action.type) {
    case "UPDATE_TREE":
      return {
        repo: {
          owner: action.owner,
          repo: action.repo,
          pullRequestNumber: action.pullRequestNumber,
          tree: action.tree,
          selectedFile: null
        }
      };
    case "UPDATE_SELECTED_FILE":
      if (!state.repo) {
        return state;
      }
      return {
        repo: {
          ...state.repo,
          selectedFile: action.state
        }
      };
    default:
      return state;
  }
};
