"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SystemLogo() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("Sistema Visualizador");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      if (!response.ok) return;

      const data = await response.json();
      const config = data.config || {};

      setLogoUrl(config.site_logo || "");
      setTitle(config.site_title || "Sistema Visualizador");
    } catch (error) {
      console.error("Error fetching system config:", error);
    }
  };

  if (logoUrl && logoUrl.trim() !== "") {
    return (
      <Image
        src={logoUrl}
        alt={title}
        width={200}
        height={50}
        className="h-12 w-auto object-contain"
        priority
      />
    );
  }

  // Mostrar placeholder cuando no hay logo configurado
  return (
    <div className="flex items-center justify-center bg-neutral-200 h-12 w-[200px] rounded-lg">
      <span className="text-sm font-semibold text-neutral-600">{title}</span>
    </div>
  );
}

