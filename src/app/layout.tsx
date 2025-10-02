import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { getSystemConfig } from "@/lib/system-config";

export async function generateMetadata(): Promise<Metadata> {
	const config = await getSystemConfig();

	return {
		title: config.site_title || "Sistema Visualizador",
		description: `${config.site_title} - Visualizador de reportes Power BI`,
		icons: {
			icon: config.site_favicon
		},
	};
}

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${geist.variable}`}>
			<body className="font-sans antialiased">

				<Toaster
					position="top-right"
					duration={3000}
					richColors
				/>
				{children}
			</body>
		</html>
	);
}
