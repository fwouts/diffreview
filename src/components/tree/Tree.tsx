import {
  AddedDirectory,
  AddedFile,
  DeletedFile,
  DiffTreeEntry,
  UnchangedDirectory,
  UnchangedFile,
  UpdatedDirectory,
  UpdatedFile
} from "@/api/github/diff";
import { Action, selectFile } from "@/store/actions";
import { RepoState } from "@/store/state";
import { classNames } from "@/styling/classes";
import assertNever from "assert-never";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as styles from "./Tree.module.css";

const PureTree = (props: { tree: UpdatedDirectory | null }) => (
  <div {...classNames(styles.Tree)}>
    {props.tree === null ? (
      <div>Not loaded yet</div>
    ) : (
      <DirectoryComponent name={""} directory={props.tree} />
    )}
  </div>
);

const EntryComponent = (props: { name: string; entry: DiffTreeEntry }) => {
  switch (props.entry.kind) {
    case "added-file":
    case "deleted-file":
    case "updated-file":
    case "unchanged-file":
      return <FileComponent name={props.name} file={props.entry} />;
    case "added-dir":
    case "updated-dir":
    case "unchanged-dir":
      return <DirectoryComponent name={props.name} directory={props.entry} />;
    default:
      throw assertNever(props.entry);
  }
};

const itemMapStateToProps = (state: RepoState) => ({
  selectedPath: state.selectedFile && state.selectedFile.path
});
const itemMapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  selectFile: (path: string) => dispatch(selectFile(path))
});

const PureFileComponent = (props: {
  name: string;
  file: AddedFile | DeletedFile | UpdatedFile | UnchangedFile;
  selectedPath: string | null;
  selectFile(path: string): void;
}) => (
  <div
    {...classNames(
      styles.file,
      props.file.kind === "added-file"
        ? styles.added
        : props.file.kind === "deleted-file"
          ? styles.deleted
          : props.file.kind === "updated-file"
            ? styles.updated
            : null,
      props.selectedPath === props.file.path && styles.selected
    )}
    onClick={() => props.selectFile(props.file.path)}
  >
    {props.name}
  </div>
);

const FileComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureFileComponent);

const PureDirectoryComponent = (props: {
  name: string;
  directory: AddedDirectory | UpdatedDirectory | UnchangedDirectory;
  selectFile(path: string): void;
}) => (
  <div {...classNames(styles.directory)}>
    <header
      {...classNames(
        props.directory.kind === "added-dir"
          ? styles.added
          : props.directory.kind === "updated-dir"
            ? styles.updated
            : null,
        props.directory.kind === "unchanged-dir" ? styles.closed : styles.opened
      )}
    >
      {props.name}
    </header>
    {props.directory.kind !== "unchanged-dir" && (
      <ul>
        {Object.entries(props.directory.entries).map(([name, entry]) => (
          <EntryComponent key={name} name={name} entry={entry} />
        ))}
      </ul>
    )}
  </div>
);

const DirectoryComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureDirectoryComponent);

const mapStateToProps = (state: RepoState) => ({
  tree: state.tree
});
const mapDispatchToProps = null;

export const Tree = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureTree);
