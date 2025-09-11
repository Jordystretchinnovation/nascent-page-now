import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface Option {
  label: string
  value: string
}

interface SimpleMultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function SimpleMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: SimpleMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure data safety
  const safeOptions = Array.isArray(options) ? options : []
  const safeSelected = Array.isArray(selected) ? selected : []

  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter((i) => i !== item))
  }

  const handleSelect = (optionValue: string) => {
    if (safeSelected.includes(optionValue)) {
      onChange(safeSelected.filter((item) => item !== optionValue))
    } else {
      onChange([...safeSelected, optionValue])
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {safeSelected.length > 0 ? (
              safeSelected.map((item) => (
                <Badge
                  variant="secondary"
                  key={item}
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUnselect(item)
                  }}
                >
                  {safeOptions.find((option) => option.value === item)?.label || item}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleUnselect(item)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-50 bg-popover border" align="start">
        <div className="max-h-64 overflow-auto p-2">
          {safeOptions.length > 0 ? (
            safeOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 px-2 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-center justify-center w-4 h-4 border border-primary rounded-sm">
                  {safeSelected.includes(option.value) && (
                    <Check className="h-3 w-3 text-primary" />
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No options available
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}