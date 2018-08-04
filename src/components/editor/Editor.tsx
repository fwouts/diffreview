import * as monaco from "monaco-editor";
import React from "react";
import * as styles from "./Editor.module.css";

export interface EditorProps {}

export default class extends React.Component<EditorProps> {
  private editorRef = React.createRef<HTMLDivElement>();

  render() {
    return <div className={styles.Editor} ref={this.editorRef} />;
  }

  componentDidMount() {
    monaco.editor.createDiffEditor(this.editorRef.current!, {
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      readOnly: true
    });
  }
}
