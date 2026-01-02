"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, LayoutGrid, List, Maximize2, Minimize2, Search, Image as ImageIcon } from "lucide-react";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Report = {
  id: string;
  title: string;
  iframeHtml: string;
};

type ViewMode = "list" | "grid" | "gallery";
type GridSize = "small" | "medium" | "large";

interface DashboardViewProps {
  reports: Report[];
}

export function DashboardView({ reports }: DashboardViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [gridSize, setGridSize] = useState<GridSize>("medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    setMounted(true);
    const savedViewMode = localStorage.getItem("dashboard-view-mode") as ViewMode;
    const savedGridSize = localStorage.getItem("dashboard-grid-size") as GridSize;

    if (savedViewMode) setViewMode(savedViewMode);
    if (savedGridSize) setGridSize(savedGridSize);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dashboard-view-mode", viewMode);
      localStorage.setItem("dashboard-grid-size", gridSize);
    }
  }, [viewMode, gridSize, mounted]);


  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;

    const query = searchQuery.toLowerCase();
    return reports.filter(report =>
      report.title.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  const getGridColumns = () => {
    if (viewMode === "list" || viewMode === "gallery") return "grid-cols-1";

    switch (gridSize) {
      case "small":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case "medium":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case "large":
        return "grid-cols-1 md:grid-cols-2";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  const getPreviewSize = () => {
    if (viewMode === "list") return "medium";
    if (viewMode === "gallery") return "large";

    switch (gridSize) {
      case "small":
        return "small";
      case "medium":
        return "medium";
      case "large":
        return "large";
      default:
        return "medium";
    }
  };

  const selectedReport = filteredReports[selectedGalleryIndex];

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
                  <Button
                    variant={viewMode === "gallery" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("gallery")}
                    className={cn(
                      "flex-1 transition-all duration-200 sm:flex-none",
                    )}
                  >
                    <ImageIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Galería</span>
                  </Button>
                </div>
              </div>

              {/* Grid Size Controls - Only show in grid mode */}
              {viewMode === "grid" && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tamaño:
                  </span>
                  <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button
                      variant={gridSize === "small" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setGridSize("small")}
                      className={cn(
                        "transition-all duration-200",
                      )}
                      title="Pequeño (4 columnas)"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={gridSize === "medium" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setGridSize("medium")}
                      className={cn(
                        "transition-all duration-200",
                      )}
                      title="Mediano (3 columnas)"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={gridSize === "large" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setGridSize("large")}
                      className={cn(
                        "transition-all duration-200",
                        gridSize === "large" && "shadow-sm"
                      )}
                      title="Grande (2 columnas)"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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

      {/* Gallery View */}
      {viewMode === "gallery" && filteredReports.length > 0 && selectedReport && (
        <div className="space-y-4">
          {/* Main Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl">{selectedReport?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <DashboardPreview
                  dashboardId={selectedReport?.id || ""}
                  iframeHtml={selectedReport?.iframeHtml || ""}
                  hasAccess={true}
                  size="large"
                  className="h-full w-full"
                />
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href={`/dashboard/reportes/${selectedReport?.id}`}>
                  <Eye className="mr-2 h-5 w-5" />
                  Ver Reporte Completo
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Thumbnails */}
          {filteredReports.length > 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredReports.map((report, index) => (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedGalleryIndex(index)}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg border-2 transition-all duration-200",
                    selectedGalleryIndex === index
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <div className="h-full w-full bg-muted">
                    <DashboardPreview
                      dashboardId={report.id}
                      iframeHtml={report.iframeHtml}
                      hasAccess={true}
                      size="small"
                      className="h-full w-full"
                    />
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/60 p-2 transition-opacity",
                      selectedGalleryIndex === index ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <p className="line-clamp-2 text-center text-xs font-medium text-white">
                      {report.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* List View - Compact */}
      {viewMode === "list" && filteredReports.length > 0 && (
        <div className="space-y-3">
          {filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className={cn(
                "group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg",
                "animate-in fade-in slide-in-from-bottom-2"
              )}
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: "backwards",
              }}
            >
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
            </Card>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredReports.length > 0 && (
        <div
          className={cn(
            "grid gap-4 transition-all duration-500 ease-in-out md:gap-6",
            getGridColumns()
          )}
        >
          {filteredReports.map((report, index) => (
            <Card
              key={report.id}
              className={cn(
                "group transition-all duration-300 hover:scale-[1.02]",
                "animate-in fade-in slide-in-from-bottom-4"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-base transition-colors duration-200 group-hover:text-primary md:text-lg">
                  {report.title}
                </CardTitle>

                {/* Dashboard Preview */}
                <div className="mt-3 overflow-hidden rounded-md transition-all duration-300">
                  <DashboardPreview
                    dashboardId={report.id}
                    iframeHtml={report.iframeHtml}
                    hasAccess={true}
                    size={getPreviewSize()}
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
