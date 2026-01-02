import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/resend";
import PasswordResetEmail from "@/components/emails/password-reset-email";

function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "If the email exists, a reset code has been sent" },
				{ status: 200 },
			);
		}

		// Check rate limiting - max 3 requests per hour
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const recentTokens = await prisma.passwordResetToken.count({
			where: {
				email: email.toLowerCase(),
				createdAt: {
					gte: oneHourAgo,
				},
			},
		});

		if (recentTokens >= 3) {
			return NextResponse.json(
				{ error: "Too many reset requests. Please try again later." },
				{ status: 429 },
			);
		}

		// Generate OTP and token
		const code = generateOTP();
		const token = crypto.randomUUID();
		const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

		// Create reset token
		const resetToken = await prisma.passwordResetToken.create({
			data: {
				email: email.toLowerCase(),
				token,
				code,
				expiresAt,
			},
		});

		// Send email with OTP
		try {
			await resend.emails.send({
				from: FROM_EMAIL,
				to: email,
				subject: "Código de Verificación - Restablecer Contraseña",
				react: PasswordResetEmail({ code, email }),
			});
		} catch (emailError) {
			console.error("Error sending email:", emailError);
			// Delete the token if email fails
			await prisma.passwordResetToken.delete({
				where: { id: resetToken.id },
			});
			return NextResponse.json(
				{ error: "Failed to send email. Please try again." },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			message: "Reset code sent to your email",
			token: resetToken.token, // Return token for next step
		});
	} catch (error) {
		console.error("Error in forgot-password:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
