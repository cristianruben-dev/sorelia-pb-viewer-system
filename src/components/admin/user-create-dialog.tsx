'use client'

import { UserForm } from '@/components/forms/user-form'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { createUserAction } from '@/actions/admin/users/create-user'

interface UserCreateDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess: () => Promise<void>
}

export function UserCreateDialog({
	open,
	onOpenChange,
	onSuccess,
}: UserCreateDialogProps) {
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (data: {
		name: string
		email: string
		password?: string
		role: string
		active: boolean
	}) => {
		setIsLoading(true)
		try {
			const result = await createUserAction({
				name: data.name,
				email: data.email,
				password: data.password || '',
				role: data.role,
			})

			if (result.error) {
				toast.error('Error al crear usuario', {
					description: result.error || 'No se pudo crear el usuario',
				})
				throw new Error(result.error || 'Error al crear usuario')
			}

			toast.success('Usuario creado exitosamente', {
				description: `Se creó el usuario ${data.name} correctamente`,
			})

			onOpenChange(false)
			await onSuccess()
		} catch (error) {
			if (
				!(
					error instanceof Error &&
					error.message.includes('Error al crear usuario')
				)
			) {
				toast.error('Error inesperado', {
					description: 'Ha ocurrido un error al crear el usuario',
				})
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Crear Usuario</DialogTitle>
					<DialogDescription>
						Crea un nuevo usuario en el sistema
					</DialogDescription>
				</DialogHeader>

				<UserForm onSubmit={handleSubmit} isLoading={isLoading} />
			</DialogContent>
		</Dialog>
	)
}
