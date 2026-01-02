"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { cn } from "@/lib/utils";

import Link from "next/link";

import type { PowerBIContent } from "@prisma/client";

type ViewMode = "list" | "grid" | "gallery";
type GridSize = "small" | "medium" | "large";

export function DashboardView({ reports }: { reports: PowerBIContent[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    setMounted(true);
    const savedViewMode = localStorage.getItem("dashboard-view-mode") as ViewMode;

    if (savedViewMode) setViewMode(savedViewMode);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dashboard-view-mode", viewMode);
    }
  }, [viewMode, mounted]);


  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;

    const query = searchQuery.toLowerCase();
    return reports.filter(report =>
      report.title.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);


  return (
    <div className="space-y-4 md:space-y-6">
      {/* Control Panel */}
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Search Bar */}
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

        {/* View Controls */}
        <Card>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  Vista:
                </span>
                <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex-1 transition-all duration-200 sm:flex-none",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Cuadrícula</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex-1 transition-all duration-200 sm:flex-none",
                    )}
                  >
                    <List className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Lista</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Counter */}
        {filteredReports.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredReports.length}</span> de{" "}
            <span className="font-semibold text-foreground">{reports.length}</span> tableros
          </div>
        )}
      </div>

      {/* No Results Message */}
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontraron tableros que coincidan con &quot;{searchQuery}&quot;
          </CardContent>
        </Card>
      )}

      {/* List View - Compact */}
      {viewMode === "list" && filteredReports.length > 0 && (
        <div className="space-y-3">
          {filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className={cn(
                "group",
                "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: "backwards",
              }}
            >
              <CardContent>
                <div className="flex flex-col sm:flex-row">
                  {/* Preview Section */}
                  <div className="relative aspect-video w-full bg-muted sm:w-64 md:w-80">
                    <DashboardPreview
                      dashboardId={report.id}
                      iframeHtml={report.iframeHtml}
                      hasAccess={true}
                      size="medium"
                      className="h-full w-full"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <CardTitle className="text-base transition-colors duration-200 group-hover:text-primary md:text-lg">
                      {report.title}
                    </CardTitle>

                    <div className="mt-3 sm:mt-0">
                      <Button
                        asChild
                        size="sm"
                        className="w-full transition-all duration-200 group/button sm:w-auto"
                      >
                        <Link href={`/dashboard/reportes/${report.id}`}>
                          <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/button:scale-110" />
                          Ver Reporte
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredReports.length > 0 && (
        <div
          className={cn(
            "grid gap-4 transition-all duration-500 ease-in-out md:gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className={cn(
                "group transition-all duration-300",
                "animate-in fade-in slide-in-from-bottom-4"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-base md:text-lg">
                  {report.title}
                </CardTitle>

                {/* Dashboard Preview */}
                <div className="mt-3 overflow-hidden rounded-md transition-all duration-300">
                  <DashboardPreview
                    dashboardId={report.id}
                    iframeHtml={report.iframeHtml}
                    hasAccess={true}
                    size="medium"
                    className="w-full"
                  />
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  asChild
                  size="sm"
                  className="w-full transition-all duration-200"
                >
                  <Link href={`/dashboard/reportes/${report.id}`}>
                    <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/button:scale-110" />
                    Ver Reporte
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
