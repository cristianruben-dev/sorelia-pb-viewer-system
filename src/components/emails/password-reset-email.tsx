import { Body, Container, Head, Html, Preview } from '@react-email/components'

interface PasswordResetEmailProps {
	code: string
	email: string
}

export default function PasswordResetEmail({
	code = '123456',
	email = 'usuario@ejemplo.com',
}: PasswordResetEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Tu código de verificación es {code}</Preview>
			<Body style={{ fontFamily: 'sans-serif', padding: '20px' }}>
				<Container>
					<p>Hola,</p>
					<p>
						Tu código de restablecimiento es: <strong>{code}</strong>
					</p>
					<p>Este código expira en 15 minutos.</p>
				</Container>
			</Body>
		</Html>
	)
}
