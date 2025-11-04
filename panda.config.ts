import { defineConfig } from "@pandacss/dev";
import { globalFontface } from "./src/ui-lib/global/globalFontface";
import { globalVars } from "./src/ui-lib/global/globalVars";

import { textStyles } from "./src/ui-lib/theme/textStyles";
import { tokens } from "./src/ui-lib/theme/tokens";

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  jsxFramework: "react",

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  globalFontface,

  globalVars,

  // Useful for theme customization
  theme: {
    extend: {
      textStyles,
      tokens,
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
