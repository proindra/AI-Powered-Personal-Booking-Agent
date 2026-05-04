import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#020813",
        "error-container": "#93000a",
        "tertiary-fixed": "#c3f400",
        "surface-container": "#122131",
        "outline-variant": "#3a494a",
        "surface-dim": "#051424",
        "tertiary": "#f6ffd3",
        "on-error-container": "#ffdad6",
        "surface-variant": "#273647",
        "surface-container-high": "#1c2b3c",
        "on-background": "#d4e4fa",
        "surface-container-highest": "#273647",
        "tertiary-fixed-dim": "#abd600",
        "surface-bright": "#2c3a4c",
        "on-secondary-fixed": "#320046",
        "secondary-fixed": "#f9d8ff",
        "on-tertiary-fixed": "#161e00",
        "on-secondary-container": "#480063",
        "on-surface": "#d4e4fa",
        "outline": "#849495",
        "on-primary-container": "#006c71",
        "inverse-primary": "#00696e",
        "on-secondary-fixed-variant": "#75009e",
        "on-tertiary-container": "#536900",
        "tertiary-container": "#bfef00",
        "surface-container-low": "#0d1c2d",
        "on-tertiary-fixed-variant": "#3c4d00",
        "surface-container-lowest": "#010f1f",
        "inverse-on-surface": "#233143",
        "secondary-fixed-dim": "#ecb1ff",
        "primary-fixed-dim": "#00dce5",
        "on-secondary": "#520070",
        "primary": "#e9feff",
        "on-primary-fixed-variant": "#004f53",
        "on-primary-fixed": "#002021",
        "on-error": "#690005",
        "surface-tint": "#00dce5",
        "primary-fixed": "#63f7ff",
        "surface": "#051424",
        "secondary-container": "#d05bff",
        "on-primary": "#003739",
        "inverse-surface": "#d4e4fa",
        "on-tertiary": "#283500",
        "secondary": "#ecb1ff",
        "on-surface-variant": "#b9caca",
        "error": "#ffb4ab",
        "primary-container": "#00f5ff"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "container-padding": "32px",
        "unit": "8px",
        "gutter": "24px",
        "stack-lg": "48px",
        "stack-md": "24px",
        "stack-sm": "12px"
      },
      fontFamily: {
        "headline-md": ["Space Grotesk", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-bold": ["Inter", "sans-serif"],
        "headline-xl": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-bold": ["14px", { "lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "700" }],
        "headline-xl": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      }
    }
  }
};

export default config;


