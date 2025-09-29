import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from '@/lib/auth-server';
import { isUserAdmin } from '@/lib/access-control';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!isUserAdmin(user)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'El parámetro email es requerido' },
        { status: 400 }
      );
    }

    const foundUser = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(foundUser);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 