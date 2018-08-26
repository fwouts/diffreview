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
      <UpdatedDirectoryComponent name={""} directory={props.tree} />
    )}
  </div>
);

const EntryComponent = (props: { name: string; entry: DiffTreeEntry }) => {
  switch (props.entry.kind) {
    case "added-file":
      return <AddedFileComponent name={props.name} file={props.entry} />;
    case "deleted-file":
      return <DeletedFileComponent name={props.name} file={props.entry} />;
    case "updated-file":
      return <UpdatedFileComponent name={props.name} file={props.entry} />;
    case "unchanged-file":
      return <UnchangedFileComponent name={props.name} file={props.entry} />;
    case "added-dir":
      return (
        <AddedDirectoryComponent name={props.name} directory={props.entry} />
      );
    case "updated-dir":
      return (
        <UpdatedDirectoryComponent name={props.name} directory={props.entry} />
      );
    case "unchanged-dir":
      return (
        <UnchangedDirectoryComponent
          name={props.name}
          directory={props.entry}
        />
      );
    default:
      throw assertNever(props.entry);
  }
};

const itemMapStateToProps = null;
const itemMapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  selectFile: (path: string) => dispatch(selectFile(path))
});

const PureAddedFileComponent = (props: {
  name: string;
  file: AddedFile;
  selectFile(path: string): void;
}) => (
  <div
    {...classNames(styles.file, styles.added)}
    onClick={() => props.selectFile(props.file.path)}
  >
    {props.name}
  </div>
);

const AddedFileComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureAddedFileComponent);

const PureDeletedFileComponent = (props: {
  name: string;
  file: DeletedFile;
  selectFile(path: string): void;
}) => (
  <div
    {...classNames(styles.file, styles.deleted)}
    onClick={() => props.selectFile(props.file.path)}
  >
    {props.name}
  </div>
);

const DeletedFileComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureDeletedFileComponent);

const PureUpdatedFileComponent = (props: {
  name: string;
  file: UpdatedFile;
  selectFile(path: string): void;
}) => (
  <div
    {...classNames(styles.file, styles.updated)}
    onClick={() => props.selectFile(props.file.path)}
  >
    {props.name}
  </div>
);

const UpdatedFileComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureUpdatedFileComponent);

const PureUnchangedFileComponent = (props: {
  name: string;
  file: UnchangedFile;
  selectFile(path: string): void;
}) => (
  <div
    {...classNames(styles.file)}
    onClick={() => props.selectFile(props.file.path)}
  >
    {props.name}
  </div>
);

const UnchangedFileComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureUnchangedFileComponent);

const PureAddedDirectoryComponent = (props: {
  name: string;
  directory: AddedDirectory;
  selectFile(path: string): void;
}) => (
  <div {...classNames(styles.directory)}>
    <header {...classNames(styles.added, styles.opened)}>{props.name}</header>
    {entryList(props.directory.entries)}
  </div>
);

const AddedDirectoryComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureAddedDirectoryComponent);

const PureUpdatedDirectoryComponent = (props: {
  name: string;
  directory: UpdatedDirectory;
}) => (
  <div {...classNames(styles.directory)}>
    <header {...classNames(styles.updated, styles.opened)}>{props.name}</header>
    {entryList(props.directory.entries)}
  </div>
);

const UpdatedDirectoryComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureUpdatedDirectoryComponent);

const PureUnchangedDirectoryComponent = (props: {
  name: string;
  directory: UnchangedDirectory;
}) => (
  // TODO: Consider letting users expand the content.
  <div {...classNames(styles.directory, styles.closed)}>
    <header>{props.name}</header>
  </div>
);

const UnchangedDirectoryComponent = connect(
  itemMapStateToProps,
  itemMapDispatchToProps
)(PureUnchangedDirectoryComponent);

const entryList = (entries: { [entryName: string]: DiffTreeEntry }) => (
  <ul>
    {Object.entries(entries).map(([name, entry]) => (
      <EntryComponent key={name} name={name} entry={entry} />
    ))}
  </ul>
);

const mapStateToProps = (state: RepoState) => ({
  tree: state.tree
});
const mapDispatchToProps = null;

export const Tree = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureTree);
