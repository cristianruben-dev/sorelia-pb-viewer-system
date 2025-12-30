import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const { token, code } = await request.json();

		if (!token || !code) {
			return NextResponse.json(
				{ error: "Token and code are required" },
				{ status: 400 },
			);
		}

		// Find the reset token
		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		});

		if (!resetToken) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 400 },
			);
		}

		// Check if already used
		if (resetToken.used) {
			return NextResponse.json(
				{ error: "This code has already been used" },
				{ status: 400 },
			);
		}

		// Check if expired
		if (new Date() > resetToken.expiresAt) {
			return NextResponse.json(
				{ error: "This code has expired" },
				{ status: 400 },
			);
		}

		// Verify the code
		if (resetToken.code !== code) {
			return NextResponse.json({ error: "Invalid code" }, { status: 400 });
		}

		// Mark as verified (but not used yet)
		await prisma.passwordResetToken.update({
			where: { id: resetToken.id },
			data: { verified: true },
		});

		return NextResponse.json({
			message: "Code verified successfully",
			email: resetToken.email,
		});
	} catch (error) {
		console.error("Error in verify-otp:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
