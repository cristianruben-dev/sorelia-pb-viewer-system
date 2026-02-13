import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filterAccessibleReports } from "@/lib/access-control";
import { getCurrentUser } from "@/lib/auth-server";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

import Link from "next/link";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
	searchParams: Promise<{ search?: string }>;
}

export default async function DashboardPage({
	searchParams,
}: DashboardPageProps) {
	const resolvedSearchParams = await searchParams;
	const searchQuery = resolvedSearchParams.search?.toLowerCase();

	const user = await getCurrentUser();
	let reports = await filterAccessibleReports(user);

	if (searchQuery && reports) {
		reports = reports.filter((report) =>
			report.title.toLowerCase().includes(searchQuery),
		);
	}

	if (!reports || reports.length === 0) {
		return (
			<Card>
				<CardContent className="text-center text-muted-foreground py-12">
					No hay reportes disponibles en este momento.
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4 md:space-y-6">
			<div
				className={cn(
					"grid gap-4 transition-all duration-500 ease-in-out md:gap-6",
					"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
				)}
			>
				{reports.map((report, index) => (
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
							<CardTitle className="line-clamp-2 text-base md:text-lg text-center text-primary">
								{report.title}
							</CardTitle>

							<DashboardPreview
								iframeHtml={report.iframeHtml}
								hasAccess={true}
								className="w-full"
							/>

							<Button
								asChild
								size="sm"
								className="w-full transition-all duration-200 mt-2 py-6"
							>
								<Link href={`/dashboard/reportes/${report.id}`}>
									<Eye className="mr-2 h-4 w-4" />
									Ver Reporte
								</Link>
							</Button>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
