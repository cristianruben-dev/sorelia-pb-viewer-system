"use client";

import Image from "next/image";

export function SystemLogo() {
	return (
		<Image
				src="https://res.cloudinary.com/dwunbkj8v/image/upload/v1759435125/sorelia-powerbi/config/gd378kkoenesylaogmdp.png"
				alt="Logotipo seguridad GTO"
				width={200}
				height={50}
				className="h-16 w-auto object-contain"
				priority
			/>
	);
}
