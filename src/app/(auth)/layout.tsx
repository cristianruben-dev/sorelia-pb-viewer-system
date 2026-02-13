import Image from "next/image";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen h-screen bg-[#f7f8fa] flex flex-col overflow-hidden">
			<nav className="bg-white border-b border-gray-200 w-full z-50 flex-shrink-0">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 py-4">
						<Image
							src="https://res.cloudinary.com/dwunbkj8v/image/upload/v1759435125/sorelia-powerbi/config/gd378kkoenesylaogmdp.png"
							alt="Logotipo seguridad GTO"
							width={200}
							height={50}
							className="h-20 w-auto object-contain"
							priority
						/>

						<div className="flex items-center gap-4">
							<h2 className="text-sm text-primary font-bold">METRA</h2>
							<div className="w-px h-10 bg-primary" />
							<p className="text-xs text-primary font-bold leading-tight max-w-[280px]">
								MONITOREO, ESTADISTICA TENDENCIA Y REPORTES PARA EL ANALISIS DE
								LA DLPC
							</p>
						</div>
					</div>
				</div>
			</nav>

			<div className="flex-1 flex items-center justify-center w-full px-4">
				<div className="w-full max-w-2xl">{children}</div>
			</div>

			<footer className="absolute bottom-0 w-full bg-white py-4 text-sm text-center text-gray-500 shadow-sm border-t border-gray-100">
				© 2026 - Coordinación General Administrativa: Monitoreo, estadística,
				tendencia y reportes para el análisis de la DLPC.
			</footer>
		</main>
	);
}
