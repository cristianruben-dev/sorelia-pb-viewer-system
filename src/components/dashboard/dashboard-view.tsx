"use client";

import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";

import Link from "next/link";

import type { PowerBIContent } from "@prisma/client";

export function DashboardView({ reports }: { reports: PowerBIContent[] }) {
	const [searchQuery, setSearchQuery] = useState("");

	// Filter reports based on search query
	const filteredReports = useMemo(() => {
		if (!searchQuery.trim()) return reports;

		const query = searchQuery.toLowerCase();
		return reports.filter((report) =>
			report.title.toLowerCase().includes(query),
		);
	}, [reports, searchQuery]);

	return (
		<div className="space-y-4 md:space-y-6">
			{/* Control Panel */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Buscar tableros..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10 transition-all duration-200 focus:shadow-md"
				/>
			</div>

			{/* No Results Message */}
			{filteredReports.length === 0 && (
				<Card>
					<CardContent className="py-12 text-center text-muted-foreground">
						No se encontraron tableros que coincidan con &quot;{searchQuery}
						&quot;
					</CardContent>
				</Card>
			)}

			{/* Grid View */}
			{filteredReports.length > 0 && (
				<div
					className={cn(
						"grid gap-4 transition-all duration-500 ease-in-out md:gap-6",
						"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
					)}
				>
					{filteredReports.map((report, index) => (
						<Card
							key={report.id}
							className={cn(
								"group transition-all duration-300",
								"animate-in fade-in slide-in-from-bottom-4",
							)}
							style={{
								animationDelay: `${index * 50}ms`,
								animationFillMode: "backwards",
							}}
						>
							<CardHeader>
								<CardTitle className="line-clamp-2 text-base md:text-lg">
									{report.title}
								</CardTitle>

								<DashboardPreview
									dashboardId={report.id}
									iframeHtml={report.iframeHtml}
									hasAccess={true}
									size="medium"
									className="w-full"
								/>

								<Button
									asChild
									size="sm"
									className="w-full transition-all duration-200 mt-2"
								>
									<Link href={`/dashboard/reportes/${report.id}`}>
										<Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/button:scale-110" />
										Ver Reporte
									</Link>
								</Button>
							</CardHeader>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
