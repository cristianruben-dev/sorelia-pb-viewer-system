"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Maximize, Minimize } from "lucide-react";
import { createPortal } from "react-dom";

interface FullscreenDashboardProps {
  iframeHtml: string;
  title: string;
  children: React.ReactNode;
}

export function FullscreenDashboard({ iframeHtml, title, children }: FullscreenDashboardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => {
    setIsFullscreen(true);
    // Prevent body scroll when fullscreen is open
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        closeFullscreen();
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isFullscreen]);

  const fullscreenModal = isFullscreen && typeof window !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-50 bg-black animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold truncate">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeFullscreen}
            className="text-white hidden sm:flex"
          >
            <Minimize className="h-4 w-4 mr-2" />
            Salir de Pantalla Completa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeFullscreen}
            className="text-white"
            title="Cerrar (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="h-[calc(100vh-64px)] w-full bg-white">
        <div
          dangerouslySetInnerHTML={{
            __html: iframeHtml.replace(/width="[^"]*"/g, 'width="100%"').replace(/height="[^"]*"/g, 'height="100%"')
          }}
          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
        />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div onClick={openFullscreen}>
        {children}
      </div>
      {fullscreenModal}
    </>
  );
} 