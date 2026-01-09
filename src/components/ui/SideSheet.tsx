import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface SideSheetProps {
  children: React.ReactNode;
  content: (closeSheet: () => void) => React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  saveText?: string;
  closeText?: string;
  showFooter?: boolean;
}

export function SideSheet({
  children,
  content,
  title,
  description,
  closeText = "Cerrar",
  showFooter = false,
}: SideSheetProps) {
  const [open, setOpen] = useState(false);

  const closesheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="pb-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">{content(closesheet)}</div>
        {showFooter && (
          <SheetFooter className="flex-row justify-between gap-2 border-t-2">
            <Button variant="default" onClick={closesheet} className="grow">
              {closeText}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SideSheet;
