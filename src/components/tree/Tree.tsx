import { UpdatedDirectory } from "@/api/github/diff";
import { RepoState } from "@/store/state";
import React from "react";
import { connect } from "react-redux";
import * as styles from "./Tree.module.css";

const PureTree = (props: { tree: UpdatedDirectory | null }) => {
  return (
    <pre className={styles.Tree}>{JSON.stringify(props.tree, null, 2)}</pre>
  );
};

const mapStateToProps = (state: RepoState) => ({
  tree: state.tree
});
const mapDispatchToProps = null;

export const Tree = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureTree);
