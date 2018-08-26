import { FileDiff } from "@/api/github/file";
import { Editor } from "@/components/editor/Editor";
import { Tree } from "@/components/tree/Tree";
import { Dispatch, fetchTree } from "@/store/actions";
import { RepoState } from "@/store/state";
import React from "react";
import { connect } from "react-redux";
import "./App.css";
import * as styles from "./App.module.css";

const PureApp = (props: { load: () => void; fileDiff: FileDiff }) => (
  <div className={styles.App}>
    <button onClick={props.load}>Load</button>
    <Tree />
    <Editor content={props.fileDiff} />
  </div>
);

const mapStateToProps = (state: RepoState): { fileDiff: FileDiff } => ({
  fileDiff:
    state.selectedFile && state.selectedFile.kind === "loaded"
      ? state.selectedFile
      : {
          before: null,
          after: null
        }
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: () => dispatch(fetchTree())
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureApp);
