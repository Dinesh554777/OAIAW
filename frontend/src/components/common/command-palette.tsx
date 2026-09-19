"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Search, FileCode, TestTube, Bot, ShieldCheck, Terminal, GitBranch } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Workspace">
          <CommandItem>
            <Search className="mr-2 h-4 w-4" />
            <span>Search Files</span>
          </CommandItem>
          <CommandItem>
            <FileCode className="mr-2 h-4 w-4" />
            <span>Open File</span>
          </CommandItem>
          <CommandItem>
            <TestTube className="mr-2 h-4 w-4" />
            <span>Run Tests</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tools">
          <CommandItem>
            <Bot className="mr-2 h-4 w-4 text-ai" />
            <span>Open AI Assistant</span>
          </CommandItem>
          <CommandItem>
            <ShieldCheck className="mr-2 h-4 w-4 text-success" />
            <span>View Security Events</span>
          </CommandItem>
          <CommandItem>
            <GitBranch className="mr-2 h-4 w-4" />
            <span>View Git History</span>
          </CommandItem>
          <CommandItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>Open Terminal</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
