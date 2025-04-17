"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown, Folder, File, Trash2, FileCode, FileText, FileJson, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

// File system item type definitions
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

interface FileTreeProps {
  items: FileSystemItemType[]
  selectedItemId: string | null
  setSelectedItemId: (id: string | null) => void
  setActiveFileId: (id: string | null) => void
  toggleFolder: (id: string) => void
  removeItem: (id: string) => void
  parentId?: string | null
  level?: number
}

export function FileTree({
  items,
  selectedItemId,
  setSelectedItemId,
  setActiveFileId,
  toggleFolder,
  removeItem,
  parentId = null,
  level = 0,
}: FileTreeProps) {
  // Filter items for this level
  const levelItems = items.filter((item) => item.parentId === parentId)

  // Sort items: folders first, then files, both alphabetically
  const sortedItems = [...levelItems].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1
    if (a.type === "file" && b.type === "folder") return 1
    return a.name.localeCompare(b.name)
  })

  // Get file icon based on file extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode className="h-4 w-4 mr-1.5" />
      case "json":
        return <FileJson className="h-4 w-4 mr-1.5" />
      case "md":
      case "txt":
        return <FileText className="h-4 w-4 mr-1.5" />
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <FileImage className="h-4 w-4 mr-1.5" />
      default:
        return <File className="h-4 w-4 mr-1.5" />
    }
  }

  if (sortedItems.length === 0) {
    return null
  }

  return (
    <ul className="space-y-1">
      {sortedItems.map((item) => (
        <li key={item.id}>
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-md text-sm group",
              selectedItemId === item.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
              level > 0 && "ml-4",
            )}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedItemId(item.id)
              if (item.type === "file") {
                setActiveFileId(item.id)
              }
            }}
            onDoubleClick={() => {
              if (item.type === "folder") {
                toggleFolder(item.id)
              }
            }}
          >
            {item.type === "folder" ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 mr-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFolder(item.id)
                  }}
                >
                  {(item as FolderItem).isOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <Folder className="h-4 w-4 mr-1.5 text-blue-500" />
                <span className="flex-1 truncate">{item.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Are you sure you want to delete "${item.name}" and all its contents?`)) {
                      removeItem(item.id)
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <>
                {getFileIcon(item.name)}
                <span className="flex-1 truncate">
                  {item.name}
                  {(item as FileItem).isDirty && <span className="text-muted-foreground ml-1">*</span>}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                      removeItem(item.id)
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>

          {/* Render children for folders */}
          {item.type === "folder" && (item as FolderItem).isOpen && (
            <FileTree
              items={items}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              setActiveFileId={setActiveFileId}
              toggleFolder={toggleFolder}
              removeItem={removeItem}
              parentId={item.id}
              level={level + 1}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
