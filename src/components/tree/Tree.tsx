import * as models from "@/api/models";
import { getTree } from "@/store/selectors";
import { RepoState } from "@/store/state";
import React from "react";
import { connect } from "react-redux";
import * as styles from "./Tree.module.css";

const PureTree = (props: { tree: models.Tree | null }) => {
  return (
    <pre className={styles.Tree}>{JSON.stringify(props.tree, null, 2)}</pre>
  );
};

const mapStateToProps = (state: RepoState) => ({
  tree: getTree(state)
});
const mapDispatchToProps = null;

export const Tree = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureTree);
