import "@/styles/globals.css";

import type { Metadata } from "next";
import { Protest_Strike, Google_Sans_Flex } from "next/font/google";
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

const protest_strike = Protest_Strike({
	weight: ["400"],
	subsets: ["latin"],
	variable: "--font-protest-strike",
});

const google_sans_flex = Google_Sans_Flex({
	subsets: ["latin"],
	variable: "--font-google-sans-flex",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="es" className={`${protest_strike.variable} ${google_sans_flex.variable}`}>
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
