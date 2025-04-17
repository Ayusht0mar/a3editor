"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Editor } from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Moon, Sun, FolderPlus, FilePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileTree } from "./file-tree"
import { getLanguageFromFilename } from "./file-utlis"

// File system item type definitions

interface CodeEditorProps {
    projectName?: string
}

interface FileSystemItem {
  id: string
  name: string
  type: "file" | "folder"
  parentId: string | null
}

interface FileItem extends FileSystemItem {
  type: "file"
  language: string
  content: string
  isDirty: boolean
}

interface FolderItem extends FileSystemItem {
  type: "folder"
  isOpen: boolean
}

type FileSystemItemType = FileItem | FolderItem

// Theme options
const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "vs-dark" },
  { label: "High Contrast", value: "hc-black" },
]

// Font size options
const fontSizeOptions = [
  { label: "12px", value: 12 },
  { label: "14px", value: 14 },
  { label: "16px", value: 16 },
  { label: "18px", value: 18 },
  { label: "20px", value: 20 },
]

export default function CodeEditor(projectName: CodeEditorProps) {
  // State for files and folders
  const [items, setItems] = useState<FileSystemItemType[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // State for editor settings
  const [theme, setTheme] = useState<string>("vs-dark")
  const [fontSize, setFontSize] = useState<number>(14)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(250)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  // State for dialogs
  const [newFileDialogOpen, setNewFileDialogOpen] = useState<boolean>(false)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState<boolean>(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false)

  // Refs
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Get active file
  const activeFile = items.find((item) => item.type === "file" && item.id === activeFileId) as FileItem | undefined

  // Get open files (for tabs)
  const openFiles = items.filter((item) => item.type === "file") as FileItem[]

  // Handle editor mounting
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  // Create a new file
  const createNewFile = (name: string, parentId: string | null = null) => {
    const language = getLanguageFromFilename(name)

    const newFile: FileItem = {
      id: Date.now().toString(),
      name,
      type: "file",
      language,
      content: "",
      isDirty: false,
      parentId,
    }

    setItems((prevItems) => [...prevItems, newFile])
    setActiveFileId(newFile.id)
    setNewFileDialogOpen(false)
  }

  // Create a new folder
  const createNewFolder = (name: string, parentId: string | null = null) => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name,
      type: "folder",
      isOpen: true,
      parentId,
    }

    setItems((prevItems) => [...prevItems, newFolder])
    setNewFolderDialogOpen(false)
  }

  // Handle file content change
  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId || !value) return

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.type === "file" && item.id === activeFileId ? { ...item, content: value, isDirty: true } : item,
      ),
    )
  }

  // Close a file
  const closeFile = (fileId: string) => {
    const fileToClose = items.find((item) => item.type === "file" && item.id === fileId) as FileItem | undefined

    if (fileToClose?.isDirty) {
      // In a real application, you might want to prompt the user to save
      if (!confirm(`Save changes to ${fileToClose.name} before closing?`)) {
        removeItem(fileId)
        return
      }

      // Save the file before closing
      setItems((prevItems) =>
        prevItems.map((item) => (item.type === "file" && item.id === fileId ? { ...item, isDirty: false } : item)),
      )
    }

    removeItem(fileId)
  }

  // Remove an item from the state
  const removeItem = (itemId: string) => {
    // First, get all child items (if it's a folder)
    const childItemIds = getChildItemIds(itemId)

    // Remove the item and all its children
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId && !childItemIds.includes(item.id)))

    // If we're closing the active file, activate another file if available
    if (itemId === activeFileId) {
      const remainingFiles = items.filter((item) => item.type === "file" && item.id !== itemId) as FileItem[]
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[0].id)
      } else {
        setActiveFileId(null)
      }
    }

    // If we're removing the selected item, clear the selection
    if (itemId === selectedItemId) {
      setSelectedItemId(null)
    }
  }

  // Get all child item IDs for a folder
  const getChildItemIds = (folderId: string): string[] => {
    const directChildren = items.filter((item) => item.parentId === folderId)
    const childIds = directChildren.map((item) => item.id)

    // Recursively get children of subfolders
    const folderChildren = directChildren
      .filter((item) => item.type === "folder")
      .flatMap((folder) => getChildItemIds(folder.id))

    return [...childIds, ...folderChildren]
  }

  // Toggle folder open/closed state
  const toggleFolder = (folderId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.type === "folder" && item.id === folderId ? { ...item, isOpen: !item.isOpen } : item,
      ),
    )
  }

  // Handle sidebar resizing
  const startResizing = () => {
    setIsResizing(true)
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth > 160 && newWidth < 500) {
        setSidebarWidth(newWidth)
      }
    }
  }, [isResizing])

  // Create a default folder and file when the component mounts if no items exist
  useEffect(() => {
    if (items.length === 0) {
      const rootFolderId = Date.now().toString()

      // Create a root folder
      const rootFolder: FolderItem = {
        id: rootFolderId,
        name: "root",
        type: "folder",
        isOpen: true,
        parentId: null,
      }

      // Create a default file inside the root folder
      const defaultFile: FileItem = {
        id: (Date.now() + 1).toString(),
        name: "untitled.js",
        type: "file",
        language: "javascript",
        content: "// Write your code here\n\nconsole.log('Hello, world!');\n",
        isDirty: false,
        parentId: rootFolderId,
      }

      setItems([rootFolder, defaultFile])
      setActiveFileId(defaultFile.id)
    }
  }, [items.length])

  // Add event listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => resize(e)
    const handleMouseUp = () => stopResizing()

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resize])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full  border border-neutral-800 rounded-lg overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 h-screen w-screen border-none rounded-none",
      )}
    >

      {/* Main Content Area with Sidebar and Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="h-full border-neutral-700 border-r bg-neutral-900 overflow-auto " style={{ width: `${sidebarWidth}px` }}>
          <div>
                <div className="py-1 px-2 flex justify-between items-center w-full">
                    <h3 className="font-medium">{projectName?.projectName}</h3>
                    <div>
                        <Button className="py-0 px-0" size="sm"  onClick={() => setNewFileDialogOpen(true)}>
                            <FilePlus />
                        </Button>

                        <Button  size="sm" onClick={() => setNewFolderDialogOpen(true)}>
                            <FolderPlus />
                        </Button>
                    </div>

                </div>
          
                <FileTree
                    items={items}
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    setActiveFileId={setActiveFileId}
                    toggleFolder={toggleFolder}
                    removeItem={removeItem}
                />
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="w-1 bg-neutral-700  cursor-col-resize"
          onMouseDown={startResizing}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs and Editor */}
          {openFiles.length > 0 ? (
            <Tabs value={activeFileId || ""} onValueChange={setActiveFileId} className="flex-1 flex flex-col">
              <div className="flex items-center border-b overflow-x-auto">
                <TabsList className="h-10 bg-transparent">
                  {openFiles.map((file) => (
                    <TabsTrigger
                      key={file.id}
                      value={file.id}
                      className="flex items-center gap-1 px-3 data-[state=active]:bg-background"
                    >
                      {file.name}
                      {file.isDirty && <span className="text-muted-foreground ml-1">*</span>}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeFile(file.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {openFiles.map((file) => (
                <TabsContent
                  key={file.id}
                  value={file.id}
                  className="flex-1 p-0 data-[state=active]:flex data-[state=inactive]:hidden"
                >
                  <Editor
                    height="100%"
                    language={file.language}
                    value={file.content}
                    theme={theme}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      fontSize: fontSize,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      lineNumbers: "on",
                      wordWrap: "on",
                      tabSize: 2,
                      renderLineHighlight: "all",
                    }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 p-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">No files open</h3>
                <p className="text-muted-foreground">Create a new file to get started</p>
              </div>
              <Button onClick={() => setNewFileDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                New File
              </Button>
            </div>
          )}

          {/* Status Bar */}
          <div className="flex items-center justify-between p-2 border-t bg-muted/40 text-xs">
            <div className="flex items-center gap-4">
              {activeFile && (
                <>
                  <span>{activeFile.language.toUpperCase()}</span>
                  <span>Line: {editorRef.current?.getPosition()?.lineNumber || 1}</span>
                  <span>Column: {editorRef.current?.getPosition()?.column || 1}</span>
                </>
              )}
            </div>
            <div>{theme === "vs-dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}</div>
          </div>
        </div>
      </div>

      {/* New File Dialog */}
      <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const fileName = formData.get("fileName") as string

              if (fileName) {
                // If a folder is selected, create the file inside that folder
                const parentId =
                  selectedItemId && items.find((item) => item.id === selectedItemId && item.type === "folder")
                    ? selectedItemId
                    : null

                createNewFile(fileName, parentId)
              }
            }}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <label htmlFor="fileName" className="text-sm font-medium">
                File Name
              </label>
              <Input id="fileName" name="fileName" placeholder="example.js" defaultValue="untitled.js" required />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {selectedItemId && items.find((item) => item.id === selectedItemId && item.type === "folder")
                  ? `This file will be created in the selected folder: ${items.find((item) => item.id === selectedItemId)?.name}`
                  : "This file will be created in the root folder"}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setNewFileDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const folderName = formData.get("folderName") as string

              if (folderName) {
                // If a folder is selected, create the new folder inside that folder
                const parentId =
                  selectedItemId && items.find((item) => item.id === selectedItemId && item.type === "folder")
                    ? selectedItemId
                    : null

                createNewFolder(folderName, parentId)
              }
            }}
            className="space-y-4 pt-4"
          >
            <div className="space-y-2">
              <label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </label>
              <Input id="folderName" name="folderName" placeholder="my-folder" defaultValue="new-folder" required />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {selectedItemId && items.find((item) => item.id === selectedItemId && item.type === "folder")
                  ? `This folder will be created in the selected folder: ${items.find((item) => item.id === selectedItemId)?.name}`
                  : "This folder will be created in the root folder"}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editor Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="theme" className="text-sm font-medium">
                Theme
              </label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="fontSize" className="text-sm font-medium">
                Font Size
              </label>
              <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
