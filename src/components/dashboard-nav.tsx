"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/user-dropdown";
import { Home, Menu, Layout, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { SystemLogo } from "@/components/system-logo";

import type { User } from "@prisma/client";

export function DashboardNav({ user }: { user: User }) {
	const pathname = usePathname();

	const userIsAdmin = user.role.includes("admin");

	const handleLogout = async () => {
		await signOut();
	};

	const navItems = [
		{
			title: "Dashboard",
			href: "/dashboard",
			icon: Home,
		},
		...(userIsAdmin
			? [
				{
					title: "Panel Admin",
					href: "/admin/usuarios",
					icon: Layout,
				},
			]
			: []),
	];

	return (
		<nav className="bg-white border-b border-gray-200 w-full z-50">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex justify-between h-20">
					<div className="flex items-center gap-8">
						<SystemLogo />

						<div className="hidden md:flex md:space-x-4">
							{navItems.map((item) => {
								// Para admin, consideramos activo si la ruta actual es /admin/*
								const isActive =
									item.href === "/admin/usuarios"
										? pathname.startsWith("/admin")
										: pathname === item.href;

								return (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"inline-flex items-center px-3 py-2 text-sm font-medium rounded-md",
											isActive
												? "bg-blue-50 text-blue-600"
												: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
										)}
									>
										<item.icon className="mr-2 h-4 w-4" />
										{item.title}
									</Link>
								);
							})}
						</div>
					</div>

					{/* User Dropdown - Desktop */}
					<div className="hidden md:flex items-center">
						<UserDropdown user={user} />
					</div>

					{/* Mobile menu dropdown */}
					<div className="flex items-center md:hidden">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<Menu className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								{navItems.map((item) => {
									const isActive =
										item.href === "/admin/usuarios"
											? pathname.startsWith("/admin")
											: pathname === item.href;

									return (
										<DropdownMenuItem key={item.href} asChild>
											<Link
												href={item.href}
												className={cn(
													"flex items-center",
													isActive && "bg-accent text-accent-foreground",
												)}
											>
												<item.icon className="mr-2 h-4 w-4" />
												{item.title}
											</Link>
										</DropdownMenuItem>
									);
								})}

								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									Cerrar Sesión
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	);
}
