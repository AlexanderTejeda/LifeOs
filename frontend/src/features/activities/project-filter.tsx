import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, Pencil, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import type { Project } from './activities.types'

interface ProjectFilterProps {
  projects: Project[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onCreate: () => void
  onEdit: (project: Project) => void
}

export function ProjectFilter({ projects, selectedId, onSelect, onCreate, onEdit }: ProjectFilterProps) {
  const [open, setOpen] = useState(false)
  const selected = projects.find((p) => p.id === selectedId) ?? null

  const choose = (id: string | null) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button variant="outline" size="sm" className="justify-between gap-2">
              <span className="flex items-center gap-2">
                {selected ? (
                  <span className="size-2 rounded-full" style={{ backgroundColor: selected.color ?? '#71717a' }} />
                ) : (
                  <FolderKanban className="size-4 text-muted-foreground" />
                )}
                {selected ? selected.name : 'Todos los proyectos'}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent align="start" className="w-64 p-0">
          <Command>
            <CommandInput placeholder="Buscar proyecto..." />
            <CommandList>
              <CommandEmpty>Sin proyectos.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="__todos" onSelect={() => choose(null)}>
                  <Check className={cn('size-4', !selectedId ? 'opacity-100' : 'opacity-0')} />
                  Todos los proyectos
                </CommandItem>
                {projects.map((p) => (
                  <CommandItem key={p.id} value={p.name} onSelect={() => choose(p.id)}>
                    <Check className={cn('size-4', selectedId === p.id ? 'opacity-100' : 'opacity-0')} />
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.color ?? '#71717a' }} />
                    {p.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    onCreate()
                  }}
                >
                  <Plus className="size-4" />
                  Crear proyecto
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          title={`Editar ${selected.name}`}
          onClick={() => onEdit(selected)}
        >
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  )
}
