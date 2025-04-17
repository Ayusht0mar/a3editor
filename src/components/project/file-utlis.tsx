// Map file extensions to Monaco Editor language identifiers
const languageMap: Record<string, string> = {
    // JavaScript
    js: "javascript",
    jsx: "javascript",
    mjs: "javascript",
    cjs: "javascript",
  
    // TypeScript
    ts: "typescript",
    tsx: "typescript",
  
    // HTML
    html: "html",
    htm: "html",
    xhtml: "html",
  
    // CSS
    css: "css",
    scss: "scss",
    less: "less",
  
    // JSON
    json: "json",
  
    // Markdown
    md: "markdown",
    markdown: "markdown",
  
    // Python
    py: "python",
    pyc: "python",
    pyd: "python",
    pyo: "python",
  
    // Java
    java: "java",
  
    // C#
    cs: "csharp",
  
    // PHP
    php: "php",
  
    // Ruby
    rb: "ruby",
  
    // Go
    go: "go",
  
    // SQL
    sql: "sql",
  
    // XML
    xml: "xml",
  
    // YAML
    yml: "yaml",
    yaml: "yaml",
  
    // Shell
    sh: "shell",
    bash: "shell",
  
    // C/C++
    c: "c",
    cpp: "cpp",
    h: "cpp",
    hpp: "cpp",
  }
  
  /**
   * Determines the language for Monaco Editor based on file extension
   */
  export function getLanguageFromFilename(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase() || ""
    return languageMap[extension] || "plaintext"
  }
  
  /**
   * Gets the file extension from a filename
   */
  export function getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || ""
  }
  
  /**
   * Checks if a filename is valid
   */
  export function isValidFilename(filename: string): boolean {
    // Basic validation - no empty strings, no special characters except dots, dashes, and underscores
    return !!filename && /^[a-zA-Z0-9_\-.]+$/.test(filename)
  }
  