import Image from "next/image";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen h-screen bg-gray-100 flex flex-col overflow-hidden">
			<nav className="bg-white border-b border-gray-200 w-full z-50 flex-shrink-0">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between gap-4 py-4">
						<Image
							src="https://res.cloudinary.com/dwunbkj8v/image/upload/v1759435125/sorelia-powerbi/config/gd378kkoenesylaogmdp.png"
							alt="Logotipo seguridad GTO"
							width={200}
							height={50}
							className="h-20 w-auto object-contain"
							priority
						/>

						<div>
							<h2 className="md:text-2xl text-2xl font-bold font-vollkorn font-bold text-primary">
								METRA
							</h2>
							<p className="text-sm text-muted-foreground font-vollkorn font-bold">
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
		</main>
	);
}
