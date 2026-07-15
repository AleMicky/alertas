import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function AppSearchForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("relative", className)} {...props}>
      <Label htmlFor="search" className="sr-only">
        Buscar
      </Label>
      <Search
        className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground/50 select-none"
        aria-hidden
      />
      <Input
        id="search"
        placeholder="Buscar..."
        className="h-7 border-transparent bg-muted/60 pl-7 text-xs shadow-none placeholder:text-muted-foreground/50 focus-visible:border-border focus-visible:bg-background focus-visible:ring-1"
      />
    </form>
  )
}
