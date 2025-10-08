// components/PageContainer.tsx
import React from "react";
import clsx from "clsx";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={clsx("pt-4", className)}>
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
