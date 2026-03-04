import { canUserAccessReport } from '@/lib/access-control'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { logReportAccess } from '@/lib/report-logger'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
	params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: PageProps) => {
	const resolvedParams = await params
	const report = await prisma.powerBIContent.findUnique({
		where: { id: resolvedParams.id },
	})

	if (!report) {
		return {
			title: 'Reporte no encontrado',
			description: 'Reporte no encontrado',
		}
	}

	return {
		title: report.title,
		description: report.title,
	}
}

export default async function ReportePage({ params }: PageProps) {
	const resolvedParams = await params
	const user = await getCurrentUser()

	if (!user) {
		redirect('/login')
	}

	const report = await prisma.powerBIContent.findUnique({
		where: { id: resolvedParams.id },
	})

	if (!report) {
		notFound()
	}

	const hasAccess = await canUserAccessReport(user, resolvedParams.id)
	if (!hasAccess) {
		redirect('/dashboard')
	}

	const headersList = await headers()
	await logReportAccess(
		user.id,
		resolvedParams.id,
		report.title,
		headersList.get('x-forwarded-for') ?? undefined,
		headersList.get('user-agent') ?? undefined,
	)

	const processIframeHtml = (html: string) => {
		if (!html) return ''

		// Reemplazar los atributos de ancho y altura para ocupar todo el espacio
		return html
			.replace(/width="[^"]*"/g, 'width="100%"')
			.replace(/height="[^"]*"/g, 'height="100%"')
			.replace(/style="[^"]*"/g, 'style="width:100%;height:100%;border:none;"')
	}

	const processedIframeHtml = report.iframeHtml
		? processIframeHtml(report.iframeHtml)
		: ''

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold font-vollkorn text-primary">
				{report.title}
			</h1>

			{/* Reporte */}
			<div className="border rounded-lg overflow-hidden bg-white w-full">
				{processedIframeHtml ? (
					<div
						className="w-full h-[calc(100vh-200px)]"
						dangerouslySetInnerHTML={{ __html: processedIframeHtml }}
					/>
				) : (
					<div className="flex items-center justify-center h-[400px] text-muted-foreground">
						<div className="text-center">
							<h3 className="text-lg font-medium">Reporte no disponible</h3>
							<p>Este reporte aún no tiene contenido configurado.</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
