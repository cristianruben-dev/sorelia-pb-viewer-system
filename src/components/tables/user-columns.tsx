'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import type { User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { deleteUserAction } from '@/actions/admin/users/delete-user'

export type UserWithCounts = User & {
	_count: {
		sessions: number
	}
}

export const createUserColumns = (
	onRolesUpdated: () => void,
): ColumnDef<UserWithCounts>[] => [
	{
		accessorKey: 'name',
		header: 'Usuario',
		cell: ({ row }) => {
			const user = row.original
			return (
				<div className="flex flex-col">
					<span className="font-medium">{user.name}</span>
					<span className="text-sm text-muted-foreground">{user.email}</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'role',
		header: 'Rol',
		cell: ({ row }) => {
			const user = row.original
			const isAdmin = user.role.includes('admin')

			return (
				<Badge variant={isAdmin ? 'destructive' : 'secondary'}>
					{user.role}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'active',
		header: 'Estado',
		cell: ({ row }) => {
			const user = row.original

			return (
				<Badge variant={user.active ? 'default' : 'outline'}>
					{user.active ? 'Activo' : 'Inactivo'}
				</Badge>
			)
		},
	},
	{
		id: 'actions',
		header: 'Acciones',
		cell: ({ row }) => {
			const user = row.original

			const handleDelete = async () => {
				try {
					const result = await deleteUserAction(user.id)

					if (result.error) {
						toast.error('Error al eliminar usuario', {
							description: result.error || 'No se pudo eliminar el usuario del sistema',
						})
						throw new Error(result.error || 'Error al eliminar usuario')
					}

					toast.success('Usuario eliminado', {
						description: `El usuario ${user.name} ha sido eliminado correctamente`,
					})

					onRolesUpdated() // Recargar datos después de eliminar
				} catch (error) {
					if (
						!(
							error instanceof Error &&
							error.message.includes('Error al eliminar usuario')
						)
					) {
						toast.error('Error inesperado', {
							description: 'Ha ocurrido un error al eliminar el usuario',
						})
					}
				}
			}

			return (
				<div className="flex items-center gap-2 justify-center">
					<Button variant="outline" size="sm" title="Editar usuario">
						<Pencil className="h-4 w-4" />
					</Button>

					<DeleteConfirmationDialog
						trigger={
							<Button variant="outline" size="sm" title="Eliminar usuario">
								<Trash2 className="h-4 w-4 text-red-500" />
							</Button>
						}
						title="Eliminar Usuario"
						description="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
						onConfirm={handleDelete}
					/>
				</div>
			)
		},
	},
]

export const userColumns = createUserColumns(() => {})
