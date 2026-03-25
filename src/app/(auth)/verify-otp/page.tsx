'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyOtpAction } from '@/actions/auth/verify-otp'
import { forgotPasswordAction } from '@/actions/auth/forgot-password'

export default function VerifyOTPPage() {
	const router = useRouter()
	const [otp, setOtp] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [token, setToken] = useState('')
	const [email, setEmail] = useState('')
	const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds

	useEffect(() => {
		// Get token and email from sessionStorage
		const storedToken = sessionStorage.getItem('resetToken')
		const storedEmail = sessionStorage.getItem('resetEmail')

		if (!storedToken || !storedEmail) {
			router.push('/forgot-password')
			return
		}

		setToken(storedToken)
		setEmail(storedEmail)

		// Start countdown timer
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [router])

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const handleVerify = async () => {
		if (otp.length !== 6) {
			setError('Please enter a 6-digit code')
			return
		}

		setError('')
		setIsLoading(true)

		try {
			const data = await verifyOtpAction(token, otp)

			if (data.error) {
				setError(data.error || 'Invalid code')
				setIsLoading(false)
				return
			}

			// Redirect to reset password page
			router.push('/reset-password')
		} catch (err) {
			setError('An error occurred. Please try again.')
			setIsLoading(false)
		}
	}

	const handleResend = async () => {
		setError('')
		setIsLoading(true)

		try {
			const data = await forgotPasswordAction(email)

			if (data.error || !data.token) {
				setError(data.error || 'Failed to resend code')
				setIsLoading(false)
				return
			}

			// Update token
			sessionStorage.setItem('resetToken', data.token as string)
			setToken(data.token as string)
			setTimeLeft(15 * 60) // Reset timer
			setOtp('') // Clear OTP input
			setIsLoading(false)
		} catch (err) {
			setError('An error occurred. Please try again.')
			setIsLoading(false)
		}
	}

	// Auto-submit when 6 digits are entered
	useEffect(() => {
		if (otp.length === 6 && !isLoading) {
			handleVerify()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [otp])

	return (
		<div className="p-4">
			<Card className="w-full">
				<CardHeader className="text-center relative">
					<Link href="/forgot-password" className="absolute left-4 top-4">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<CardTitle className="font-bold text-primary pt-2">
						VERIFICAR CÓDIGO
					</CardTitle>
					<CardDescription>
						Ingresa el código de 6 dígitos que enviamos a{' '}
						<strong>{email}</strong>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-col items-center space-y-4">
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={(value) => setOtp(value)}
							disabled={isLoading || timeLeft === 0}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>

						{timeLeft > 0 ? (
							<p className="text-sm text-muted-foreground">
								Código expira en:{' '}
								<span className="font-mono font-semibold">
									{formatTime(timeLeft)}
								</span>
							</p>
						) : (
							<p className="text-sm text-destructive font-semibold">
								El código ha expirado
							</p>
						)}
					</div>

					{error && (
						<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					)}

					{isLoading && (
						<div className="flex items-center justify-center text-sm text-muted-foreground">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Verificando...
						</div>
					)}

					<div className="space-y-2">
						<Button
							onClick={handleResend}
							variant="default"
							className="w-full py-6 mt-6"
							disabled={isLoading || timeLeft > 13 * 60} // Can resend after 2 minutes
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Reenviar código
						</Button>

						<div className="text-center text-sm text-muted-foreground">
							¿No recibiste el código? Revisa tu carpeta de spam
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
