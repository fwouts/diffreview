import { FileDiff } from "@/api/github/file";
import { Editor } from "@/components/editor/Editor";
import { Tree } from "@/components/tree/Tree";
import { Dispatch, fetchTreeWithFile } from "@/store/actions";
import { RepoState } from "@/store/state";
import React from "react";
import { connect } from "react-redux";
import "./App.css";
import * as styles from "./App.module.css";

interface PureAppProps {
  owner: string;
  repo: string;
  pullRequestNumber: number;
  filePath: string | null;
  fileDiff: FileDiff;
  loadRepoWithFile: (
    owner: string,
    repo: string,
    pullRequestNumber: number,
    path: string | null
  ) => void;
}

class PureApp extends React.Component<PureAppProps> {
  componentDidMount() {
    this.props.loadRepoWithFile(
      this.props.owner,
      this.props.repo,
      this.props.pullRequestNumber,
      this.props.filePath
    );
  }

  componentDidUpdate(prevProps: PureAppProps) {
    if (
      this.props.owner !== prevProps.owner ||
      this.props.repo !== prevProps.repo ||
      this.props.pullRequestNumber !== prevProps.pullRequestNumber ||
      this.props.filePath !== prevProps.filePath
    ) {
      this.props.loadRepoWithFile(
        this.props.owner,
        this.props.repo,
        this.props.pullRequestNumber,
        this.props.filePath
      );
    }
  }

  render = () => (
    <div className={styles.App}>
      <Tree />
      <Editor content={this.props.fileDiff} filePath={this.props.filePath} />
    </div>
  );
}

const mapStateToProps = (
  state: RepoState
): {
  fileDiff: FileDiff;
} => ({
  fileDiff:
    state.selectedFile && state.selectedFile.kind === "loaded"
      ? state.selectedFile
      : {
          before: null,
          after: null
        }
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadRepoWithFile: (
    owner: string,
    repo: string,
    pullRequestNumber: number,
    path: string | null
  ) => dispatch(fetchTreeWithFile(owner, repo, pullRequestNumber, path))
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureApp);
