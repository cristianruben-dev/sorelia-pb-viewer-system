import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Sorelia",
	description: "Sorelia - Visualizador de reportes Power BI",
	icons: {
		icon: [
			{ url: "/favicon.png", sizes: "any" }
		],
	},
	manifest: "/manifest.json",
	viewport: "width=device-width, initial-scale=1"
};

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
