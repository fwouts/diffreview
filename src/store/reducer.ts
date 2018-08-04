import { Action } from "@/store/actions";
import { RepoState } from "@/store/state";
import * as config from "../config";

export default (
  state: RepoState = {
    repoOwner: config.OWNER,
    repoName: config.REPO,
    leftBranch: {
      name: config.LEFT_BRANCH,
      data: {
        kind: "unloaded"
      }
    },
    rightBranch: {
      name: config.RIGHT_BRANCH,
      data: {
        kind: "unloaded"
      }
    }
  },
  action: Action
): RepoState => {
  switch (action.type) {
    case "UPDATE_BRANCH_DATA":
      if (action.side === "left") {
        return {
          ...state,
          leftBranch: {
            name: action.name,
            data: action.data
          }
        };
      } else {
        return {
          ...state,
          rightBranch: {
            name: action.name,
            data: action.data
          }
        };
      }
  }
  console.warn(`Unhandled action: ${action.type}.`);
  return state;
};
