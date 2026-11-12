export const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf8jjgUoocAqTmnFxuqNiUGeRmjdY1931C_3YJSFyscA7Dx4A/viewform?embedded=true";

export const profile = {
  name: "Yuya Takemasa",
  role: "Full Stack Developer",
  /** 見出しとして置くときの改行位置 */
  tagline: ["ソフトウェアと", "ハードウェアの両面から、", "価値あるプロダクトを創る"],
  avatar: "https://github.com/yuya-take.png?size=320",
  links: [
    { label: "GitHub", href: "https://github.com/yuya-take" },
    { label: "LinkedIn", href: "https://linkedin.com/in/yuya-takemasa-456763285" },
  ],
};

export const facts = [
  { label: "出身地", value: "千葉県" },
  { label: "学歴", value: "千葉大学大学院 修士課程修了" },
  { label: "趣味", value: "ゴルフ・旅行" },
];

export const chapters = [
  {
    title: "Academic",
    body: "大学時代には、Pythonを使って実験装置を制御するプログラムを開発し、実験結果の分析やデータ処理を行うほか、必要に応じて回路設計も手がけるなど、ソフトウェアとハードウェアの両面で経験を積んできました。また、C++を用いたシミュレーションにより、実験結果と理想的な値との差を確認し、実験対象となる装置の校正を行うことにも取り組みました。",
  },
  {
    title: "Career",
    body: "その後、ITエンジニアとしてのキャリアをスタートし、フロントエンド・バックエンド、さらにはインフラまで幅広く対応しています。フロントエンドではReactやNext.jsを活用し、デザインと使いやすさを両立させたインターフェースを作成。バックエンドでは、RustやPythonを使ってスケーラブルなシステムの構築に取り組んでいます。また、DockerやCI/CDの仕組みを取り入れ、環境構築やデプロイの効率化にも注力しています。",
  },
  {
    title: "Philosophy",
    body: "実務を通じてスキルを着実に磨きながら、プロジェクトに価値を提供できるよう日々努力しています。また新しい技術やアイデアに常にオープンで、チームと協力しながらより良い結果を追求することを心がけています。エンジニアとして技術を磨きつつ、プロジェクトに積極的に貢献する姿勢を持って取り組んでいます。",
  },
];

export type ProjectSlug = "scorescreen" | "latent" | "dew" | "insaporire" | "yuya-claude-code";

export type Project = {
  slug: ProjectSlug;
  name: string;
  tagline: string;
  description: string;
  features: { title: string; desc: string }[];
  tech: string[];
  status?: string;
  /** http で始まるものは外部サイトとして別タブで開く */
  link: { href: string; label: string };
  /** 案件ごとの配色。space separated RGB で持ち、透明度つきで使い回す。 */
  theme: { bg: string; fg: string; accent: string; panel: string };
};

export const projects: Project[] = [
  {
    slug: "scorescreen",
    name: "ScoreScreen AI",
    tagline: "野球スコアブックをデジタル化し、AIがデータを分析するiOSアプリ",
    description:
      "「スコアをつける」から「スコアで戦う」へ。チーム管理・試合記録・AI分析を一つのアプリに統合し、チーム戦略と選手の成長をデータの力でサポートします。",
    features: [
      { title: "チーム管理", desc: "チーム作成・選手登録・役割管理" },
      { title: "デジタル記録", desc: "試合作成からスコア入力・結果記録" },
      { title: "AI分析", desc: "自動解析・レポート生成・戦略提案" },
    ],
    tech: ["iOS", "AI", "スポーツテック"],
    link: { href: "https://scorescreen-ai-lp.vercel.app/", label: "ランディングページを見る" },
    theme: { bg: "14 22 38", fg: "236 240 246", accent: "255 184 46", panel: "9 14 26" },
  },
  {
    slug: "latent",
    name: "Latent",
    tagline: "アイデアが時間とともに「冷めていく」iOSメモアプリ",
    description:
      "メモを溜めるのではなく、忘れることを設計に組み込んだアイデア帳。各アイデアは「温度」を持ち、放置すると指数関数的に冷めてインクの色が薄れていきます。整理やタグ付けは不要で、関心の所在が濃淡と光のにじみとして紙の上に浮かび上がります。",
    features: [
      { title: "温度と減衰", desc: "触れないアイデアは暖色から青灰へ薄れていく" },
      { title: "浮上", desc: "冷めかけたアイデアを1日1件ホームに提示" },
      { title: "再燃", desc: "冷えたアイデアを開くと、にじみが広がり色が戻る" },
    ],
    tech: ["iOS", "React Native", "Expo", "SQLite"],
    link: { href: "/latent", label: "サポートページを見る" },
    theme: { bg: "236 231 222", fg: "61 56 51", accent: "164 85 30", panel: "247 244 238" },
  },
  {
    slug: "dew",
    name: "Dew",
    tagline: "水やりの間隔を設定させず、記録から学習する iOS アプリ",
    description:
      "「3日ごと」のような固定間隔は、夏は水切れ、冬は根腐れを起こします。Dew は水やりの間隔をユーザーに一度も設定させません。「水をあげたら1タップ」の記録から株ごとの間隔を学習し、季節で自動補正します。ハーブ・野菜56種の図鑑から選んで登録でき、記録は端末の中にだけ保存されます。",
    features: [
      { title: "1タップの記録", desc: "水やりと雨をその場で。追加の質問は任意" },
      { title: "矛盾したときだけ学習", desc: "回答が推定とずれたときだけ間隔を動かす" },
      { title: "季節で自動補正", desc: "冬は伸ばし、夏は縮める。根腐れを防ぐ" },
    ],
    tech: ["iOS", "React Native", "Expo", "TypeScript"],
    status: "TestFlight",
    link: { href: "/dew", label: "サポートページを見る" },
    theme: { bg: "38 62 46", fg: "240 239 228", accent: "196 226 164", panel: "250 248 243" },
  },
  {
    slug: "insaporire",
    name: "Insaporire",
    tagline: "料理の試作をバージョンで重ね、違いと気づきを残す iOS アプリ",
    description:
      "料理人が修行時代にやる「試作の記録と振り返り」のためのノート。完成したレシピを 1 枚で持つのではなく、同じ料理を作り直すたびに新しいバージョンとして追記し、前回との違い・その日の条件・気づきを残します。パンや出汁のように配合が味を決める料理では、基準材料を指定すると比率の自動計算と分量の換算が使えます。記録は端末の中にだけ保存されます。",
    features: [
      { title: "バージョンで追記", desc: "材料・手順は履歴として残し、気づきは後から書き足す" },
      { title: "並べて比較", desc: "2 つのバージョンを左右に並べ、変わった箇所を強調" },
      { title: "比率と換算", desc: "基準材料を決めた料理だけ、比率と分量スケールを表示" },
    ],
    tech: ["iOS", "React Native", "Expo", "SQLite"],
    status: "TestFlight",
    link: { href: "/insaporire", label: "サポートページを見る" },
    theme: { bg: "138 63 31", fg: "250 240 226", accent: "255 205 150", panel: "246 241 232" },
  },
  {
    slug: "yuya-claude-code",
    name: "yuya-claude-code",
    tagline: "必要な pack だけをプロジェクトに入れる、Claude Code の設定集",
    description:
      "普段の開発で使っている Claude Code の skills・agents・rules・hooks を、用途ごとの pack にまとめて公開しています。プロジェクトのルートでコマンドを 1 つ実行すると、選んだ pack が .claude/ に展開されます。手元で変更したファイルは上書きせず、同じコマンドの再実行で配布元の最新版に更新できます。",
    features: [
      { title: "pack を選んで入れる", desc: "6 つの pack から選ぶ。依存する pack は自動で追加" },
      { title: "Issue から PR まで", desc: "/dev で設計・実装・セルフレビュー、/pr で PR を作成" },
      { title: "差分に合うレビュー", desc: "/rv が変更されたファイルの種類に合う reviewer だけを起動" },
    ],
    tech: ["Claude Code", "Shell", "Python", "MIT License"],
    status: "オープンソース",
    link: { href: "https://github.com/yuya-take/yuya-claude-code", label: "GitHub で見る" },
    theme: { bg: "223 228 234", fg: "22 28 38", accent: "32 78 150", panel: "20 24 32" },
  },
];

export const skillGroups = [
  {
    name: "フロントエンド",
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt",
      "Svelte",
      "SvelteKit",
      "Tauri",
      "React Native",
      "Flutter",
    ],
  },
  { name: "バックエンド", skills: ["Rust", "Python", "Axum", "FastAPI", "Django", "REST API"] },
  { name: "データベース", skills: ["MySQL", "PostgreSQL", "DynamoDB"] },
  { name: "DevOps", skills: ["Docker", "CI/CD", "AWS", "CloudFormation"] },
  { name: "その他", skills: ["Go", "C++", "Kafka", "EMQX"] },
];

export const contact = {
  lead: ["お仕事のご相談やご質問など、", "お気軽にお問い合わせください。"],
  note: "以下のフォームまたはSNSからどうぞ。",
};
