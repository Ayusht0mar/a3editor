declare namespace monaco {
  namespace editor {
    interface IStandaloneCodeEditor {
      getPosition(): { lineNumber: number; column: number } | null;
    }
  }
} 