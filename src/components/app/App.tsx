import Editor from "@/components/editor/Editor";
import { Tree } from "@/components/tree/Tree";
import { Dispatch, fetchTree } from "@/store/actions";
import React from "react";
import { connect } from "react-redux";
import "./App.css";
import * as styles from "./App.module.css";

const PureApp = (props: { load: () => void }) => {
  return (
    <div className={styles.App}>
      <button onClick={props.load}>Load</button>
      <Tree />
      <Editor />
    </div>
  );
};

const mapStateToProps = null;
const mapDispatchToProps = (dispatch: Dispatch) => ({
  load: () => dispatch(fetchTree())
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureApp);
