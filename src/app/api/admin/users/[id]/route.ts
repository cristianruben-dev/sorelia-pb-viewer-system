import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";
import { isUserAdmin } from "@/lib/access-control";

const updateUserSchema = z.object({
	name: z.string().min(1, "El nombre es requerido").optional(),
	email: z.string().email("Email inválido").optional(),
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres")
		.optional(),
	role: z.string().optional(),
	active: z.boolean().optional(),
});

interface RouteParams {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await getCurrentUser();
		const { id } = await params;

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: "No autorizado" }, { status: 403 });
		}

		const targetUser = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				active: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						sessions: true,
					},
				},
			},
		});

		if (!targetUser) {
			return NextResponse.json(
				{ error: "Usuario no encontrado" },
				{ status: 404 },
			);
		}

		return NextResponse.json(targetUser);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await getCurrentUser();
		const { id } = await params;

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: "No autorizado" }, { status: 403 });
		}

		const body = await request.json();
		const validatedData = updateUserSchema.parse(body);

		// Verificar que el usuario existe
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (!existingUser) {
			return NextResponse.json(
				{ error: "Usuario no encontrado" },
				{ status: 404 },
			);
		}

		// Si se está actualizando el email, verificar que no existe
		if (validatedData.email && validatedData.email !== existingUser.email) {
			const emailExists = await prisma.user.findUnique({
				where: { email: validatedData.email.toLowerCase() },
			});

			if (emailExists) {
				return NextResponse.json(
					{ error: "Ya existe un usuario con ese email" },
					{ status: 400 },
				);
			}
		}

		// Preparar datos de actualización
		const updateData: any = {};
		if (validatedData.name) updateData.name = validatedData.name;
		if (validatedData.email)
			updateData.email = validatedData.email.toLowerCase();
		if (validatedData.role) updateData.role = validatedData.role;
		if (validatedData.active !== undefined)
			updateData.active = validatedData.active;
		if (validatedData.password) {
			updateData.password = await hashPassword(validatedData.password);
		}

		// Actualizar usuario
		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				active: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						sessions: true,
					},
				},
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
		}

		console.error("Error updating user:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const user = await getCurrentUser();
		const { id } = await params;

		if (!isUserAdmin(user)) {
			return NextResponse.json({ error: "No autorizado" }, { status: 403 });
		}

		// Verificar que el usuario existe
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (!existingUser) {
			return NextResponse.json(
				{ error: "Usuario no encontrado" },
				{ status: 404 },
			);
		}

		// No permitir que un admin se elimine a sí mismo
		if (id === user.id) {
			return NextResponse.json(
				{ error: "No puedes eliminarte a ti mismo" },
				{ status: 400 },
			);
		}

		// Eliminar el usuario (esto eliminará en cascada las relaciones)
		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Usuario eliminado exitosamente" });
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
