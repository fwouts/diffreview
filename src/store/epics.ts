import {
  AddedDirectory,
  loadDiffTree,
  UnchangedDirectory,
  UpdatedDirectory
} from "@/api/github/diff";
import { loadDiffFile, ShaDiff } from "@/api/github/file";
import { producePath } from "@/routing";
import {
  Action,
  FetchTreeAction,
  FetchTreeWithFileAction,
  SelectFileAction,
  updateSelectedFile,
  UpdateSelectedFileAction,
  updateTree,
  UpdateTreeAction
} from "@/store/actions";
import { RepoState } from "@/store/state";
import { push, RouterAction } from "connected-react-router";
import {
  ActionsObservable,
  combineEpics,
  ofType,
  StateObservable
} from "redux-observable";
import { concat, empty, from, Observable, of } from "rxjs";
import { map, merge, mergeMap } from "rxjs/operators";
import * as config from "../config";

const fetchTreeWithFileEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<Action> =>
  action$.pipe(
    ofType("FETCH_TREE_WITH_FILE"),
    mergeMap((action: FetchTreeWithFileAction) => {
      const updateTree = fetchTree(
        state$.value,
        action.owner,
        action.repo,
        action.pullRequestNumber
      );
      return concat(
        updateTree,
        updateTree.pipe(
          mergeMap(
            updateTreeAction =>
              action.path
                ? selectFile(
                    action.owner,
                    action.repo,
                    updateTreeAction.tree,
                    action.path
                  )
                : empty()
          )
        )
      );
    })
  );

const fetchTreeEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<Action> =>
  action$.pipe(
    ofType("FETCH_TREE"),
    mergeMap((action: FetchTreeAction) =>
      fetchTree(
        state$.value,
        action.owner,
        action.repo,
        action.pullRequestNumber
      )
    )
  );

const navigateToFileEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<RouterAction> =>
  action$.pipe(
    ofType("NAVIGATE_TO_FILE"),
    mergeMap((action: SelectFileAction) =>
      of(
        push(
          producePath(
            state$.value.owner!,
            state$.value.repo!,
            state$.value.pullRequestNumber!,
            action.path
          )
        )
      )
    )
  );

function fetchTree(
  state: RepoState,
  owner: string,
  repo: string,
  pullRequestNumber: number
): Observable<UpdateTreeAction> {
  if (state.owner === owner && state.repo === repo && state.tree) {
    // No need to reload.
    return of(updateTree(owner, repo, pullRequestNumber, state.tree));
  }
  return from(
    loadDiffTree(config.GITHUB_TOKEN, owner, repo, pullRequestNumber)
  ).pipe(map(tree => updateTree(owner, repo, pullRequestNumber, tree)));
}

function selectFile(
  owner: string,
  repo: string,
  tree: UpdatedDirectory | null,
  path: string
): Observable<UpdateSelectedFileAction> {
  const shaDiff = getShaDiff(tree, path);
  return from([
    updateSelectedFile({
      kind: "loading",
      path
    })
  ]).pipe(
    merge(
      from(loadDiffFile(config.GITHUB_TOKEN, owner, repo, shaDiff)).pipe(
        map(fileDiff =>
          updateSelectedFile({
            kind: "loaded",
            path,
            before: fileDiff.before,
            after: fileDiff.after
          })
        )
      )
    )
  );
}

function getShaDiff(
  tree: UpdatedDirectory | AddedDirectory | UnchangedDirectory | null,
  path: string
): ShaDiff {
  if (!tree) {
    throw new Error(`Empty tree`);
  }
  if (!path.startsWith("/")) {
    throw new Error(`${path} does not start with a /`);
  }
  const nextSlash = path.indexOf("/", 1);
  if (nextSlash === -1) {
    const fileName = path.substr(1);
    const entry = tree.entries[fileName];
    if (!entry) {
      throw new Error(`${fileName} does not exist`);
    }
    switch (entry.kind) {
      case "added-file":
        return {
          beforeSha: null,
          afterSha: entry.fileShaAfter
        };
      case "deleted-file":
        return {
          beforeSha: entry.fileShaBefore,
          afterSha: null
        };
      case "unchanged-file":
        return {
          beforeSha: entry.fileSha,
          afterSha: entry.fileSha
        };
      case "updated-file":
        return {
          beforeSha: entry.fileShaBefore,
          afterSha: entry.fileShaAfter
        };
      default:
        throw new Error(`${fileName} is not a file`);
    }
  } else {
    const dirName = path.substr(1, nextSlash - 1);
    const remainingPath = path.substr(nextSlash);
    const dir = tree.entries[dirName];
    if (!dir) {
      throw new Error(`${dirName} does not exist`);
    }
    switch (dir.kind) {
      case "added-dir":
      case "unchanged-dir":
      case "updated-dir":
        return getShaDiff(dir, remainingPath);
      default:
        throw new Error(`${dirName} is not a directory`);
    }
  }
}

export const rootEpic = combineEpics(
  fetchTreeWithFileEpic,
  fetchTreeEpic,
  navigateToFileEpic
);
