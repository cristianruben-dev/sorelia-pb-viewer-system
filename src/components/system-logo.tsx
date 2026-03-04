'use client'

import Image from 'next/image'
import logo from '@/assets/seguridad-gto-logo.png'

export function SystemLogo() {
	return (
		<Image
			src={logo}
			alt="Logotipo seguridad GTO"
			width={200}
			height={50}
			className="h-16 w-auto object-contain"
			priority
		/>
	)
}
