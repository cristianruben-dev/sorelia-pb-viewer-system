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

					<div className="h-6 w-px bg-neutral-500 mt-2" />

					<h2 className="text-2xl font-bold font-vollkorn text-primary mt-2.5">
						METRA
					</h2>
				</Link>

				<div className="hidden md:flex items-center">
					<UserDropdown user={user} />
				</div>

				<div className="flex items-center md:hidden">
					<UserDropdownMobile user={user} />
				</div>
			</div>
		</nav>
	);
}
