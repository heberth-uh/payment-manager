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

interface SideSheetProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  saveText?: string;
  closeText?: string;
}

export function SideSheet({
  children,
  content,
  title,
  description,
  saveText = "Save changes",
  closeText = "Close",
}: SideSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-4">{content}</div>
        <SheetFooter>
          <Button type="submit">{saveText}</Button>
          <SheetClose asChild>
            <Button variant="outline">{closeText}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default SideSheet;
