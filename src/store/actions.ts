import { loadDiff, UpdatedDirectory } from "@/api/github/diff";
import { RepoState } from "@/store/state";
import { ThunkDispatch } from "redux-thunk";
import * as config from "../config";

export type Action = UpdateTreeAction;
export type Dispatch = ThunkDispatch<RepoState, any, Action>;

export function fetchBranches() {
  return async (dispatch: Dispatch, getState: () => RepoState) => {
    // TODO: Track loading and failed states.
    try {
      const state = getState();
      const tree = await loadDiff(
        config.GITHUB_TOKEN,
        state.repoOwner,
        state.repoName,
        state.oldBranch,
        state.newBranch
      );
      dispatch<Action>({
        type: "UPDATE_TREE",
        tree
      });
    } catch (e) {
      console.error(e);
      dispatch<Action>({
        type: "UPDATE_TREE",
        tree: null
      });
    }
  };
}

export type BranchSide = "left" | "right";

export interface UpdateTreeAction {
  type: "UPDATE_TREE";
  tree: UpdatedDirectory | null;
}
