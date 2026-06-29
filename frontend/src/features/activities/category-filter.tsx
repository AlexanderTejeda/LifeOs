import { Plus, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { apiMessage } from '@/lib/api-client'
import { useCategoryMutations } from './activities.queries'
import type { Category } from './activities.types'

interface CategoryFilterProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onCreate: () => void
  onEdit: (category: Category) => void
}

const chipBase =
  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors'

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
}: CategoryFilterProps) {
  const { remove } = useCategoryMutations()

  const onDelete = async (category: Category) => {
    try {
      await remove.mutateAsync(category.id)
      if (selectedId === category.id) onSelect(null)
      toast.success('Rubro eliminado')
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          chipBase,
          !selectedId
            ? 'border-transparent bg-secondary text-foreground'
            : 'text-muted-foreground hover:bg-secondary/50',
        )}
      >
        Todos
      </button>

      {categories.map((c) => {
        const active = selectedId === c.id
        return (
          <div
            key={c.id}
            className={cn(
              chipBase,
              'pr-1',
              active ? 'border-transparent bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50',
            )}
          >
            <button onClick={() => onSelect(c.id)} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: c.color ?? '#71717a' }} />
              {c.name}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full p-0.5 text-muted-foreground hover:text-foreground">
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(c)}>
                  <Pencil className="size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => onDelete(c)}>
                  <Trash2 className="size-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      })}

      <Button variant="ghost" size="sm" onClick={onCreate} className="text-muted-foreground">
        <Plus className="size-4" />
        Rubro
      </Button>
    </div>
  )
}
