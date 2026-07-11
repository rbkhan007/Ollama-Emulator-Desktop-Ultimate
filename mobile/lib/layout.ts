import { useWindowDimensions, DimensionValue } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const minSide = Math.min(width, height);
  const isTablet = minSide >= 600;
  const isSmall = minSide < 360;

  const padding = isTablet ? 28 : isSmall ? 14 : 16;

  const inner = {
    width: "100%" as DimensionValue,
    maxWidth: isTablet ? 760 : undefined,
    alignSelf: "center" as const,
    paddingHorizontal: padding,
    paddingVertical: 12,
  };

  const scale = isTablet ? 1.1 : isSmall ? 0.92 : 1;

  return { width, height, isTablet, isSmall, padding, inner, scale };
}

export function fs(base: number, scale: number) {
  return Math.round(base * scale);
}
