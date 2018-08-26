import { FileDiff } from "@/api/github/file";
import { classNames } from "@/styling/classes";
import * as monaco from "monaco-editor";
import React from "react";
import * as styles from "./Editor.module.css";

export interface EditorProps {
  filePath: string | null;
  content: FileDiff;
}

export class Editor extends React.Component<EditorProps> {
  private editor!: monaco.editor.IStandaloneDiffEditor;
  private editorRef = React.createRef<HTMLDivElement>();

  render() {
    const hidden =
      this.props.content.before === null && this.props.content.after === null;
    return (
      <div
        {...classNames(styles.Editor, hidden && styles.hidden)}
        ref={this.editorRef}
      />
    );
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
    if (!this.props.filePath) {
      // TODO: Reset the editor to empty?
      return;
    }
    this.editor.setModel({
      original: this.getOrCreateModel(
        this.props.content.before || "",
        this.props.filePath
      ),
      modified: this.getOrCreateModel(
        this.props.content.after || "",
        this.props.filePath
      )
    });
    this.editor.updateOptions({
      renderSideBySide: this.props.content.before !== this.props.content.after
    } as any);
  }

  private getOrCreateModel(content: string, filePath: string) {
    const uri = monaco.Uri.file(btoa(content) + filePath);
    const existingModel = monaco.editor.getModel(uri);
    if (existingModel) {
      return existingModel;
    }
    return monaco.editor.createModel(content, undefined, uri);
  }
}
