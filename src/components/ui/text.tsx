import { useColor } from "@/hooks/useColor";
import { FONT_SIZE } from "@/theme/globals";
import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

type TextVariant =
  | "body"
  | "title"
  | "subtitle"
  | "caption"
  | "heading"
  | "link";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

const headingVariants: TextVariant[] = ["heading", "title", "subtitle"];

// Poppins di-load per-weight (font face terpisah), jadi fontWeight
// saja tidak cukup di Android — harus dipetakan ke nama fontFamily.
const resolveFontFamily = (weight?: string | number): string => {
  const w = typeof weight === "number" ? String(weight) : weight;
  switch (w) {
    case "700":
    case "800":
    case "900":
      return "Poppins-Bold";
    case "600":
      return "Poppins-SemiBold";
    case "500":
      return "Poppins-Medium";
    default:
      return "Poppins-Regular";
  }
};

export const Text = React.memo(
  forwardRef<RNText, TextProps>(
    (
      { variant = "body", lightColor, darkColor, style, children, ...props },
      ref,
    ) => {
      const textColor = useColor("text", {
        light: lightColor,
        dark: darkColor,
      });
      const mutedColor = useColor("textMuted");
      const defaultAccessibilityRole = headingVariants.includes(variant)
        ? "header"
        : undefined;

      const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
          color: textColor,
        };

        switch (variant) {
          case "heading":
            return { ...baseStyle, fontSize: 22, fontWeight: "700" };
          case "title":
            return { ...baseStyle, fontSize: 18, fontWeight: "700" };
          case "subtitle":
            return { ...baseStyle, fontSize: 15, fontWeight: "600" };
          case "caption":
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: "400",
              color: mutedColor,
            };
          case "link":
            return {
              ...baseStyle,
              fontSize: FONT_SIZE,
              fontWeight: "500",
              textDecorationLine: "underline",
            };
          default: // 'body'
            return { ...baseStyle, fontSize: FONT_SIZE, fontWeight: "400" };
        }
      };

      // fontFamily selalu resolved dari weight AKHIR (setelah style pemanggil),
      // supaya fontWeight "600" yang diteruskan via style tetap ter-render.
      const flattened = StyleSheet.flatten([getTextStyle(), style]);
      const finalFontFamily = resolveFontFamily(flattened.fontWeight);

      return (
        <RNText
          ref={ref}
          style={[flattened, { fontFamily: finalFontFamily }]}
          accessibilityRole={defaultAccessibilityRole}
          {...props}
        >
          {children}
        </RNText>
      );
    },
  ),
);

Text.displayName = "Text";
