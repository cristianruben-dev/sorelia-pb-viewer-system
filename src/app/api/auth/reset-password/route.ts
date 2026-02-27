import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
	try {
		const { token, password } = await request.json();

		if (!token || !password) {
			return NextResponse.json(
				{ error: "Token and password are required" },
				{ status: 400 },
			);
		}

		// Validate password strength
		if (password.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters long" },
				{ status: 400 },
			);
		}

		const resetToken = await prisma.passwordResetToken.findUniqueOrThrow({
			where: { token },
		});

		if (resetToken.used) {
			return NextResponse.json(
				{ error: "This token has already been used" },
				{ status: 400 },
			);
		}

		// Check if verified
		if (!resetToken.verified) {
			return NextResponse.json(
				{ error: "Token not verified. Please verify the OTP code first." },
				{ status: 400 },
			);
		}

		// Check if expired
		if (new Date() > resetToken.expiresAt) {
			return NextResponse.json(
				{ error: "This token has expired" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUniqueOrThrow({
			where: { email: resetToken.email },
		});

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { password: hashedPassword },
			}),
			prisma.passwordResetToken.update({
				where: { id: resetToken.id },
				data: { used: true },
			}),
			prisma.session.deleteMany({
				where: { userId: user.id },
			}),
		]);

		return NextResponse.json({
			message: "Password reset successfully",
		});
	} catch (error) {
		console.error("Error in reset-password:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
