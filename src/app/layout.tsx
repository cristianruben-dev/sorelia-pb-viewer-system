import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Kepler Oil & Gas",
	description: "Kepler Oil & Gas - Visualizador de reportes Power BI",
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon.ico", sizes: "any" }
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
		],
		other: [
			{ rel: "android-chrome", url: "/android-chrome-192x192.png", sizes: "192x192" },
			{ rel: "android-chrome", url: "/android-chrome-512x512.png", sizes: "512x512" }
		]
	},
	manifest: "/site.webmanifest",
	themeColor: "#041e42",
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
