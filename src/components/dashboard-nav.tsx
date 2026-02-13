"use client";

import { SystemLogo } from "@/components/system-logo";
import { Input } from "@/components/ui/input";
import { UserDropdown } from "@/components/user-dropdown";
import type { User } from "@prisma/client";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserDropdownMobile } from "./user-dropdown-mobile";

export function DashboardNav({ user }: { user: User }) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") || "",
	); 

	// Debounce search update
	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchQuery !== (searchParams.get("search") || "")) {
				const params = new URLSearchParams(searchParams);
				if (searchQuery) {
					params.set("search", searchQuery);
				} else {
					params.delete("search");
				}
				router.replace(`/dashboard?${params.toString()}`);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery, searchParams, router]);

	const isReportPage = pathname.includes("/dashboard/reportes/");

	return (
		<>
			<nav className="bg-white border-b border-gray-200 w-full z-50">
				<div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-2">
					<Link href="/dashboard" className="flex items-center gap-4">
						<SystemLogo />
					</Link>

					<div className="flex items-center gap-4">
						<h2 className="text-sm text-primary font-bold">METRA</h2>
						<div className="w-px h-10 bg-primary" />
						<div>
							<p className="text-xs text-primary font-bold leading-tight max-w-[280px]">
								MONITOREO, ESTADISTICA TENDENCIA Y
							</p>
							<p className="text-xs text-primary font-bold leading-tight max-w-[280px]">
								REPORTES PARA EL ANALISIS DE LA DLPC
							</p>
						</div>
					</div>
				</div>
			</nav>
			<nav className="w-full border-b border-gray-200">
				<section className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-4">
					<div className="flex-1 max-w-md">
						{isReportPage ? (
							<Link
								href="/dashboard"
								className="flex items-center gap-2 text-primary font-bold hover:underline"
							>
								<ChevronLeft className="h-5 w-5" />
								Volver al listado
							</Link>
						) : (
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Buscar tableros ..."
									className="w-full bg-white pl-9"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						)}
					</div>

					<div className="hidden md:flex items-center">
						<UserDropdown user={user} />
					</div>

					<div className="flex items-center md:hidden">
						<UserDropdownMobile user={user} />
					</div>
				</section>
			</nav>
		</>
	);
}
