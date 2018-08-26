import { FileDiff } from "@/api/github/file";
import { Editor } from "@/components/editor/Editor";
import { Tree } from "@/components/tree/Tree";
import { RepoState } from "@/store/state";
import React from "react";
import { connect } from "react-redux";
import "./App.css";
import * as styles from "./App.module.css";

const PureApp = (props: { filePath: string | null; fileDiff: FileDiff }) => (
  <div className={styles.App}>
    <Tree />
    <Editor content={props.fileDiff} filePath={props.filePath} />
  </div>
);

const mapStateToProps = (
  state: RepoState
): {
  filePath: string | null;
  fileDiff: FileDiff;
} => ({
  fileDiff:
    state.selectedFile && state.selectedFile.kind === "loaded"
      ? state.selectedFile
      : {
          before: null,
          after: null
        },
  filePath: state.selectedFile && state.selectedFile.path
});
const mapDispatchToProps = null;

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureApp);
