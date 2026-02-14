import { DashboardNav } from "@/components/dashboard-nav";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

// Marcar como página dinámica para evitar errores con headers()
export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="relative min-h-screen bg-[#f7f8fa]">
			<DashboardNav user={user} />

			<main className="flex-1 overflow-y-auto p-4 w-full max-w-7xl mx-auto pb-20">
				{children}
			</main>

			<footer className="absolute bottom-0 w-full bg-white py-4 text-sm text-center text-gray-500 shadow-sm border-t border-gray-100">
				© 2026 - Coordinación General Administrativa
			</footer>
		</div>
	);
}
