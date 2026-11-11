import type { Config } from "tailwindcss";

export default {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  // タッチ端末でホバーの見た目が貼り付かないようにする
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        sub: "#666666",
        line: "#e3e3e3",
        // 案件ごとに差し替わる配色（projects[].theme）
        card: {
          bg: "rgb(var(--card-bg) / <alpha-value>)",
          fg: "rgb(var(--card-fg) / <alpha-value>)",
          accent: "rgb(var(--card-accent) / <alpha-value>)",
          panel: "rgb(var(--card-panel) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Web フォントは読み込まず、端末に入っている書体で組む
        sans: [
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"BIZ UDPGothic"',
          "Meiryo",
          "sans-serif",
        ],
        mincho: ['"Hiragino Mincho ProN"', '"Yu Mincho"', "YuMincho", '"Noto Serif JP"', "serif"],
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
} satisfies Config;
