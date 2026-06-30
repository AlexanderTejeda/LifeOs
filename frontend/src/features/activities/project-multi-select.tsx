import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
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
import { useProjects } from './activities.queries'

interface ProjectMultiSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
  onCreateProject: () => void
}

export function ProjectMultiSelect({ value, onChange, onCreateProject }: ProjectMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const { data: projects = [] } = useProjects()

  const selected = projects.filter((p) => value.includes(p.id))

  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="h-auto min-h-9 w-full justify-between py-1.5">
            <span className="flex flex-wrap gap-1">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">Selecciona proyectos</span>
              ) : (
                selected.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs"
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.color ?? '#71717a' }} />
                    {p.name}
                  </span>
                ))
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-(--anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Buscar proyecto..." />
          <CommandList>
            <CommandEmpty>Sin proyectos.</CommandEmpty>
            <CommandGroup>
              {projects.map((p) => (
                <CommandItem key={p.id} value={p.name} onSelect={() => toggle(p.id)}>
                  <Check className={cn('size-4', value.includes(p.id) ? 'opacity-100' : 'opacity-0')} />
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
                  onCreateProject()
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
  )
}
