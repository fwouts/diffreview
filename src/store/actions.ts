import { loadRepository } from "@/api/github/loader";
import { BranchData, RepoState } from "@/store/state";
import { ThunkDispatch } from "redux-thunk";
import * as config from "../config";

export type Action = UpdateBranchDataAction;
export type Dispatch = ThunkDispatch<RepoState, any, Action>;

export function fetchBranches() {
  return (dispatch: Dispatch, getState: () => RepoState) => {
    const state = getState();
    dispatch(fetchBranch("left", state.leftBranch.name));
    dispatch(fetchBranch("right", state.rightBranch.name));
  };
}

export function fetchBranch(side: BranchSide, name: string) {
  return async (dispatch: Dispatch, getState: () => RepoState) => {
    dispatch<Action>({
      type: "UPDATE_BRANCH_DATA",
      side,
      name,
      data: {
        kind: "loading"
      }
    });
    try {
      const state = getState();
      const tree = await loadRepository(
        config.GITHUB_TOKEN,
        state.repoOwner,
        state.repoName,
        name
      );
      dispatch<Action>({
        type: "UPDATE_BRANCH_DATA",
        side,
        name,
        data: {
          kind: "loaded",
          tree
        }
      });
    } catch (e) {
      console.error(e);
      dispatch<Action>({
        type: "UPDATE_BRANCH_DATA",
        side,
        name,
        data: {
          kind: "failed",
          error: e
        }
      });
    }
  };
}

export type BranchSide = "left" | "right";

export interface UpdateBranchDataAction {
  type: "UPDATE_BRANCH_DATA";
  side: BranchSide;
  name: string;
  data: BranchData;
}
