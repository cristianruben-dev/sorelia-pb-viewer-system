import "@/styles/globals.css";

import type { Metadata } from "next";
import { Google_Sans_Flex, Protest_Strike } from "next/font/google";
import { Toaster } from "sonner";
import { getSystemConfig } from "@/lib/system-config";

export async function generateMetadata(): Promise<Metadata> {
	const config = await getSystemConfig();

	return {
		title: "METRA",
		description: "METRA - Visualizador BI",
		icons: {
			icon: config.site_favicon
		},
	};
}

const google_sans_flex = Google_Sans_Flex({
	subsets: ["latin"],
	variable: "--font-google-sans-flex",
});

const protest_strike = Protest_Strike({
	variable: "--font-vollkorn",
	weight: "400",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${google_sans_flex.variable} ${protest_strike.variable}`}>
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
