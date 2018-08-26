import { FileDiff } from "@/api/github/file";
import * as monaco from "monaco-editor";
import React from "react";
import * as styles from "./Editor.module.css";

export interface EditorProps {
  content: FileDiff;
}

export class Editor extends React.Component<EditorProps> {
  private editor!: monaco.editor.IStandaloneDiffEditor;
  private editorRef = React.createRef<HTMLDivElement>();

  render() {
    return <div className={styles.Editor} ref={this.editorRef} />;
  }

  componentDidMount() {
    this.editor = monaco.editor.createDiffEditor(this.editorRef.current!, {
      automaticLayout: true,
      readOnly: true,
      theme: "vs-dark"
    });
    this.updateModel();
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    this.updateModel();
  }

  private updateModel() {
    this.editor.setModel({
      original: monaco.editor.createModel(this.props.content.before || ""),
      modified: monaco.editor.createModel(this.props.content.after || "")
    });
  }
}
