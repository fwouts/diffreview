import {
  AddedDirectory,
  AddedFile,
  DeletedDirectory,
  DeletedFile,
  DiffTreeEntry,
  UnchangedDirectory,
  UnchangedFile,
  UpdatedDirectory,
  UpdatedFile
} from "@/api/github/diff";
import { RepoState } from "@/store/state";
import { classNames } from "@/styling/classes";
import assertNever from "assert-never";
import React from "react";
import { connect } from "react-redux";
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
    case "deleted-dir":
      return (
        <DeletedDirectoryComponent name={props.name} directory={props.entry} />
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

const AddedFileComponent = (props: { name: string; file: AddedFile }) => (
  <div {...classNames(styles.file, styles.added)}>{props.name}</div>
);

const DeletedFileComponent = (props: { name: string; file: DeletedFile }) => (
  <div {...classNames(styles.file, styles.deleted)}>{props.name}</div>
);

const UpdatedFileComponent = (props: { name: string; file: UpdatedFile }) => (
  <div {...classNames(styles.file, styles.updated)}>{props.name}</div>
);

const UnchangedFileComponent = (props: {
  name: string;
  file: UnchangedFile;
}) => <div {...classNames(styles.file)}>{props.name}</div>;

const AddedDirectoryComponent = (props: {
  name: string;
  directory: AddedDirectory;
}) => (
  <div {...classNames(styles.directory)}>
    <header {...classNames(styles.added, styles.opened)}>{props.name}</header>
    {entryList(props.directory.entries)}
  </div>
);

const DeletedDirectoryComponent = (props: {
  name: string;
  directory: DeletedDirectory;
}) => (
  // TODO: Consider letting users expand the content.
  <div {...classNames(styles.directory)}>
    <header {...classNames(styles.deleted, styles.closed)}>{props.name}</header>
  </div>
);

const UpdatedDirectoryComponent = (props: {
  name: string;
  directory: UpdatedDirectory;
}) => (
  <div {...classNames(styles.directory)}>
    <header {...classNames(styles.updated, styles.opened)}>{props.name}</header>
    {entryList(props.directory.entries)}
  </div>
);

const UnchangedDirectoryComponent = (props: {
  name: string;
  directory: UnchangedDirectory;
}) => (
  // TODO: Consider letting users expand the content.
  <div {...classNames(styles.directory, styles.closed)}>
    <header>{props.name}</header>
  </div>
);

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
