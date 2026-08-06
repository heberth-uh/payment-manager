import React from "react";
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

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  actionConfirm?: () => void;
  isActionDanger?: boolean;
}

function ConfirmDialog({
  children,
  title,
  description,
  confirmText = "Continuar",
  cancelText = "Cancelar",
  actionConfirm,
  isActionDanger = true
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction className={`${isActionDanger && 'bg-red-600 hover:bg-red-700'}`} onClick={() => actionConfirm?.()}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
