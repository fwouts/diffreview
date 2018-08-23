import { loadDiff } from "@/api/github/diff";
import { Action, updateTree } from "@/store/actions";
import { RepoState } from "@/store/state";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { from, Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import * as config from "../config";

export const fetchTreeEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<Action> =>
  action$.pipe(
    ofType("FETCH_TREE"),
    mergeMap(_action =>
      from(
        loadDiff(
          config.GITHUB_TOKEN,
          state$.value.repoOwner,
          state$.value.repoName,
          state$.value.pullRequestId
        )
      ).pipe(map(tree => updateTree(tree)))
    )
  );
