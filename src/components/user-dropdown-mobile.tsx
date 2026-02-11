"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Home, Layout, LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import type { User } from "@prisma/client";

export function UserDropdownMobile({ user }: { user: User }) {
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
							<p className="text-sm font-medium leading-none">{user.name}</p>
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
	);
}
