import {
  AddedDirectory,
  loadDiff,
  UnchangedDirectory,
  UpdatedDirectory
} from "@/api/github/diff";
import { loadDiffFile, ShaDiff } from "@/api/github/file";
import {
  Action,
  SelectFileAction,
  updateSelectedFile,
  updateTree
} from "@/store/actions";
import { RepoState } from "@/store/state";
import {
  ActionsObservable,
  combineEpics,
  ofType,
  StateObservable
} from "redux-observable";
import { from, Observable } from "rxjs";
import { map, merge, mergeMap } from "rxjs/operators";
import * as config from "../config";

export const fetchTreeEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<Action> =>
  action$.pipe(
    ofType("FETCH_TREE"),
    mergeMap(
      (_action): Observable<Action> =>
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

export const selectFile = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RepoState>
): Observable<Action> =>
  action$.pipe(
    ofType("SELECT_FILE"),
    mergeMap(
      (action: SelectFileAction): Observable<Action> => {
        const shaDiff = getShaDiff(state$.value.tree, action.path);
        return from([
          updateSelectedFile({
            kind: "loading",
            path: action.path
          })
        ]).pipe(
          merge(
            from(
              loadDiffFile(
                config.GITHUB_TOKEN,
                state$.value.repoOwner,
                state$.value.repoName,
                shaDiff
              )
            ).pipe(
              map(fileDiff =>
                updateSelectedFile({
                  kind: "loaded",
                  path: action.path,
                  before: fileDiff.before,
                  after: fileDiff.after
                })
              )
            )
          )
        );
      }
    )
  );

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
export const rootEpic = combineEpics(fetchTreeEpic, selectFile);
