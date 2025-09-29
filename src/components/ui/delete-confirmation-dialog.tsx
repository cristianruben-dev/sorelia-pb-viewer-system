"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  trigger?: React.ReactNode;
  isLoading?: boolean;
  itemName?: string;
}

export function DeleteConfirmationDialog({
  title,
  description,
  onConfirm,
  trigger,
  isLoading = false,
  itemName
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error during deletion:", error);
      // El error se maneja en el componente padre
    } finally {
      setConfirming(false);
      router.refresh();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {itemName && (
              <span className="font-medium block mt-1">"{itemName}"</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={confirming}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirming || isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {confirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 