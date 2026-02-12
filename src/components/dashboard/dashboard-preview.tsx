"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Lock, AlertCircle } from "lucide-react";

interface DashboardPreviewProps {
  iframeHtml?: string;
  hasAccess: boolean;
  className?: string;
  category?: string;
}

export function DashboardPreview({
  iframeHtml,
  hasAccess,
  className = "",
  category
}: DashboardPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iframeHtml || !hasAccess) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [iframeHtml, hasAccess]);

  if (!hasAccess) {
    return (
      <div className={`h-48 ${className} border border-dashed rounded-lg bg-gray-50 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
        <div className="relative text-center text-muted-foreground">
          <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Vista Restringida</p>
          <p className="text-xs">Suscripción requerida</p>
        </div>
      </div>
    );
  }

  if (!iframeHtml) {
    return (
      <div className={`h-48 ${className} border border-dashed rounded-lg bg-gray-50 flex items-center justify-center`}>
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">En configuración</p>
        </div>
      </div>
    );
  }

  // Procesamiento mejorado del HTML del iframe
  const processIframeHtml = (html: string) => {
    let processedHtml = html
      .replace(/width="[^"]*"/g, 'width="100%"')
      .replace(/height="[^"]*"/g, 'height="100%"')
      .replace(/style="[^"]*"/g, 'style="width:100%;height:100%;border:none;"');

    // Si el HTML no contiene un iframe, creamos uno
    if (!html.includes('<iframe')) {
      processedHtml = `<iframe src="data:text/html;charset=utf-8,${encodeURIComponent(html)}" style="width:100%;height:100%;border:none;" frameborder="0"></iframe>`;
    }

    return processedHtml;
  };

  return (
    <div className={`h-48 ${className} relative overflow-hidden rounded-lg border bg-white`}>
      {/* Category badge */}
      {category && (
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 z-10 text-xs"
        >
          {category}
        </Badge>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-30">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"/>
        </div>
      )}

      <div className="absolute inset-0 z-20 cursor-pointer bg-transparent" />

      <div
        ref={containerRef}
        className="w-full h-full relative"
        style={{
          transform: 'scale(0.25)',
          transformOrigin: 'top left',
          width: '400%',
          height: '400%'
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: processIframeHtml(iframeHtml)
          }}
          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
        />
      </div>
    </div>
  );
}
