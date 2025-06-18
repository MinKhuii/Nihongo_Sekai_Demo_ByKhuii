import { useState, useEffect } from "react";
import { theme } from "@/styles/theme";

// Breakpoint type
type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

// Responsive breakpoint hooks
export function useIsMobile(): boolean {
  return useMediaQuery(
    `(max-width: ${parseInt(theme.breakpoints.tablet) - 1}px)`,
  );
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${theme.breakpoints.tablet}) and (max-width: ${parseInt(theme.breakpoints.desktop) - 1}px)`,
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${theme.breakpoints.desktop})`);
}

export function useIsWide(): boolean {
  return useMediaQuery(`(min-width: ${theme.breakpoints.wide})`);
}

// Current breakpoint hook
export function useBreakpoint(): Breakpoint {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isWide = useIsWide();

  if (isWide) return "wide";
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";
  if (isMobile) return "mobile";

  return "mobile"; // fallback
}

// Window size hook
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Responsive value hook
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}): T | undefined {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case "wide":
      return values.wide ?? values.desktop ?? values.tablet ?? values.mobile;
    case "desktop":
      return values.desktop ?? values.tablet ?? values.mobile;
    case "tablet":
      return values.tablet ?? values.mobile;
    case "mobile":
    default:
      return values.mobile;
  }
}

// Grid columns hook
export function useResponsiveColumns(
  mobileColumns: number = 1,
  tabletColumns: number = 2,
  desktopColumns: number = 4,
  wideColumns?: number,
): number {
  return (
    useResponsiveValue({
      mobile: mobileColumns,
      tablet: tabletColumns,
      desktop: desktopColumns,
      wide: wideColumns ?? desktopColumns,
    }) ?? mobileColumns
  );
}

// Spacing hook
export function useResponsiveSpacing(
  mobileSpacing: string = "1rem",
  tabletSpacing: string = "1.5rem",
  desktopSpacing: string = "2rem",
): string {
  return (
    useResponsiveValue({
      mobile: mobileSpacing,
      tablet: tabletSpacing,
      desktop: desktopSpacing,
    }) ?? mobileSpacing
  );
}

// Orientation hook
export function useOrientation(): "portrait" | "landscape" {
  const { width, height } = useWindowSize();
  return width > height ? "landscape" : "portrait";
}

// Dark mode preference hook (system)
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

// Reduced motion preference hook
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

// High contrast preference hook
export function usePrefersHighContrast(): boolean {
  return useMediaQuery("(prefers-contrast: high)");
}
