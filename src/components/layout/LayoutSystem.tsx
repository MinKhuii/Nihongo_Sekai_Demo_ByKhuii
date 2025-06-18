import React from "react";
import { cn } from "@/lib/utils";

// Page Container Component
interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "base" | "lg";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = "2xl",
  padding = "base",
  ...props
}) => {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-none",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    base: "px-4 sm:px-6 lg:px-8", // 16px default
    lg: "px-6 sm:px-8 lg:px-12",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid System Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    mobile?: 1 | 2 | 3 | 4;
    tablet?: 1 | 2 | 3 | 4 | 6;
    desktop?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  };
  gap?: "none" | "sm" | "base" | "lg" | "xl";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = { mobile: 1, tablet: 2, desktop: 4 },
  gap = "base",
  alignItems,
  justifyContent,
  ...props
}) => {
  // Grid column classes
  const getGridCols = (count: number) => {
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      8: "grid-cols-8",
      12: "grid-cols-12",
    };
    return gridColsMap[count] || "grid-cols-1";
  };

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    base: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignItemsClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyContentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "grid",
        // Mobile first approach
        getGridCols(cols.mobile || 1),
        // Tablet breakpoint
        cols.tablet && `md:${getGridCols(cols.tablet)}`,
        // Desktop breakpoint
        cols.desktop && `lg:${getGridCols(cols.desktop)}`,
        gapClasses[gap],
        alignItems && alignItemsClasses[alignItems],
        justifyContent && justifyContentClasses[justifyContent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Grid Item Component
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  order?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  span,
  order,
  ...props
}) => {
  const getColSpan = (count: number) => {
    const colSpanMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    };
    return colSpanMap[count] || "";
  };

  const getOrder = (orderNum: number) => {
    const orderMap: Record<number, string> = {
      1: "order-1",
      2: "order-2",
      3: "order-3",
      4: "order-4",
      5: "order-5",
      6: "order-6",
      7: "order-7",
      8: "order-8",
      9: "order-9",
      10: "order-10",
      11: "order-11",
      12: "order-12",
    };
    return orderMap[orderNum] || "";
  };

  return (
    <div
      className={cn(
        // Mobile span
        span?.mobile && getColSpan(span.mobile),
        // Tablet span
        span?.tablet && `md:${getColSpan(span.tablet)}`,
        // Desktop span
        span?.desktop && `lg:${getColSpan(span.desktop)}`,
        // Mobile order
        order?.mobile && getOrder(order.mobile),
        // Tablet order
        order?.tablet && `md:${getOrder(order.tablet)}`,
        // Desktop order
        order?.desktop && `lg:${getOrder(order.desktop)}`,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Section Component
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: "none" | "sm" | "base" | "lg" | "xl";
  background?: "transparent" | "primary" | "secondary" | "muted";
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  spacing = "base",
  background = "transparent",
  ...props
}) => {
  const spacingClasses = {
    none: "",
    sm: "py-8",
    base: "py-12 lg:py-16",
    lg: "py-16 lg:py-20",
    xl: "py-20 lg:py-24",
  };

  const backgroundClasses = {
    transparent: "",
    primary: "bg-nihongo-crimson-50",
    secondary: "bg-nihongo-sakura-50",
    muted: "bg-nihongo-ink-50",
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};

// Stack Component (Flexbox utility)
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "row" | "column";
  gap?: "none" | "sm" | "base" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

export const Stack: React.FC<StackProps> = ({
  children,
  className,
  direction = "column",
  gap = "base",
  align,
  justify,
  wrap = false,
  ...props
}) => {
  const directionClasses = {
    row: "flex-row",
    column: "flex-col",
  };

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    base: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        gapClasses[gap],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
