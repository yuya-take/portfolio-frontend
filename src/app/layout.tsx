import type { Metadata } from "next";
import "./globals.css";

// OG 画像などの絶対 URL の基準。Vercel では本番ドメインが自動で入る。
// それ以外の環境に置くときは NEXT_PUBLIC_SITE_URL を設定する。
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Yuya Takemasa | Full Stack Developer";
const description = "ソフトウェアとハードウェアの両面から、価値あるプロダクトを創る。Yuya Takemasa のポートフォリオ。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ja_JP" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
