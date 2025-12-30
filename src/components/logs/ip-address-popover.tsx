"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe, Network, MapPin, Clock, Loader2 } from "lucide-react";

interface IPGeolocation {
  ip: string;
  network: {
    cidr: string;
    autonomous_system?: {
      asn: number;
      name: string;
      organization: string;
      country: string;
    };
  };
  location: {
    city: string | null;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  };
}

interface IPAddressPopoverProps {
  ipAddress: string;
}

export function IPAddressPopover({ ipAddress }: IPAddressPopoverProps) {
  const [geoData, setGeoData] = useState<IPGeolocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const isLocalIP = (ip: string) => {
    return ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.");
  };

  const fetchGeoData = async () => {
    if (hasLoaded) return; // Don't fetch if already loaded

    // Check if it's a local IP
    if (isLocalIP(ipAddress)) {
      setError("Esta es una dirección IP local (localhost)");
      setHasLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://ip.guide/${ipAddress}`);
      if (!response.ok) {
        throw new Error("No se pudo obtener información de la IP");
      }

      const data: IPGeolocation = await response.json();

      // Validate that we have at least location data
      if (!data.location) {
        throw new Error("No hay datos de ubicación disponibles para esta IP");
      }

      setGeoData(data);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !hasLoaded && !isLoading) {
      fetchGeoData();
    }
  };

  // Calculate bounding box for map (roughly 0.1 degrees around the point)
  const getMapUrl = (lat: number, lon: number) => {
    const delta = 0.1;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger className="cursor-pointer text-sm text-primary underline-offset-4 transition-colors hover:underline">
        {ipAddress}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h4 className="font-semibold">Información de IP</h4>
            <p className="text-sm text-muted-foreground">{ipAddress}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Geo Data */}
          {geoData && !isLoading && (
            <>
              {/* Network Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Network className="h-4 w-4" />
                  Red
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CIDR:</span>
                    <code className="rounded bg-muted px-1 text-xs">
                      {geoData.network.cidr}
                    </code>
                  </div>
                  {geoData.network.autonomous_system && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ASN:</span>
                        <span>{geoData.network.autonomous_system.asn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organización:</span>
                        <span className="text-right">
                          {geoData.network.autonomous_system.organization}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Proveedor:</span>
                        <span>{geoData.network.autonomous_system.name}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Location Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">País:</span>
                    <Badge variant="outline">{geoData.location.country}</Badge>
                  </div>
                  {geoData.location.city && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ciudad:</span>
                      <span>{geoData.location.city}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      <Clock className="mr-1 inline h-3 w-3" />
                      Zona horaria:
                    </span>
                    <span className="text-xs">{geoData.location.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordenadas:</span>
                    <code className="text-xs">
                      {geoData.location.latitude.toFixed(4)},{" "}
                      {geoData.location.longitude.toFixed(4)}
                    </code>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Map */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4" />
                  Mapa
                </div>
                <div className="overflow-hidden rounded-md border">
                  <iframe
                    title={`Mapa de ${ipAddress}`}
                    src={getMapUrl(
                      geoData.location.latitude,
                      geoData.location.longitude
                    )}
                    className="h-48 w-full"
                    style={{ border: 0 }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
