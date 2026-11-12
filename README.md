# Yuya Takemasa — Portfolio

Next.js (App Router) と Tailwind CSS で作ったポートフォリオサイト。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 本番ビルド
npm run lint     # ESLint
npx biome check --write src   # 整形と lint
```

## 構成

```
src/
├─ app/
│  ├─ page.tsx               トップページ
│  ├─ layout.tsx             メタデータ
│  ├─ globals.css            ベースのスタイル
│  ├─ opengraph-image.tsx    共有用の OG 画像（ビルド時に生成）
│  ├─ icon.svg ほか          ファビコン類
│  └─ latent / dew / insaporire   各アプリのサポートページとプライバシーポリシー
├─ components/site/
│  ├─ ink-canvas.tsx         墨流しの背景（WebGL2。クリックで墨が落ちる）
│  ├─ reveal.tsx             見出しのせり上がりと、スクロールで現れるブロック
│  ├─ project-visual.tsx     案件ごとのデモの切り替え
│  ├─ works/                 各案件のコンセプトデモ
│  └─ contact-form.tsx       お問い合わせフォームの開閉
└─ lib/site.ts               掲載内容（プロフィール・経歴・案件・スキル）
```

## 内容を更新するとき

文章・案件・スキルは `src/lib/site.ts` にまとまっています。

- 案件を足す：`projects` に 1 件追加し、`components/site/works/` にデモを作って `project-visual.tsx` に登録する
- 案件の帯の色：`projects[].theme`
- 全体の色と書体：`tailwind.config.ts`。Web フォントは使わず、端末に入っている書体で表示します

## メモ

- 各案件のデモは、アプリの考え方を再現したものです。中のデータ（メモの文面、配合、スコアなど）はサンプルです。
- yuya-claude-code のデモだけは実物に合わせています。pack の依存関係と中身の数は `works/claude-code-visual.tsx` の `PACKS` に書いてあるので、配布元の pack を変えたときはここも直します。表示されるコマンドはそのまま実行できます。
- お問い合わせは Google フォームの埋め込みです（`src/lib/site.ts` の `GOOGLE_FORM_URL`）。ボタンを押すまで読み込みません。サポートページからの `/#contact` で来たときは最初から開きます。
- OG 画像の URL は、Vercel 以外に置く場合 `NEXT_PUBLIC_SITE_URL` の設定が必要です。
