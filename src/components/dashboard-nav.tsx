"use client";

import { SystemLogo } from "@/components/system-logo";
import { UserDropdown } from "@/components/user-dropdown";
import type { User } from "@prisma/client";
import Link from "next/link";
import { UserDropdownMobile } from "./user-dropdown-mobile";

export function DashboardNav({ user }: { user: User }) {
	return (
		<nav className="bg-white border-b border-gray-200 w-full z-50">
			<div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 py-2">
				<Link href="/dashboard" className="flex items-center gap-4">
					<SystemLogo />
				</Link>

				<div className="hidden md:flex items-center">
					<UserDropdown user={user} />
				</div>

				<div className="flex items-center md:hidden">
					<UserDropdownMobile user={user} />
				</div>

				<div className="flex items-center gap-4">
					<h2 className="text-sm text-primary font-bold">METRA</h2>
					<div className="w-px h-10 bg-primary" />
					<p className="text-xs text-primary font-bold leading-tight max-w-[280px]">
						MONITOREO, ESTADISTICA TENDENCIA Y REPORTES PARA EL ANALISIS DE LA
						DLPC
					</p>
				</div>
			</div>
		</nav>
	);
}
