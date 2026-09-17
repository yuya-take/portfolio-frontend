import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Latent サポート",
  description:
    "Latent は、思いついたアイデアを即座に記録し、時間の経過とともに「冷めていく」メモアプリです。サポート情報とよくある質問。",
};

const faqs = [
  {
    q: "データはどこに保存されますか？",
    a: "すべて端末内に保存されます。サーバーへの送信やアカウント登録はありません。詳しくはプライバシーポリシーをご覧ください。",
  },
  {
    q: "文字の色が薄くなっていくのはなぜですか？",
    a: "アイデアには「温度」があり、時間の経過とともに冷めていきます。色の濃淡は温度の表現です。アイデアを開いたり編集したりすると再び温まります。",
  },
  {
    q: "冷めるスピードは変えられますか？",
    a: "ホーム画面左上の「Latent」ロゴをタップすると、「ゆっくり／ふつう／はやい」の3段階で変更できます。",
  },
  {
    q: "アイデアを削除するには？",
    a: "アイデアの詳細画面右上の「···」から削除できます。",
  },
  {
    q: "ホーム中央に時々現れるカードは何ですか？",
    a: "冷めかけたアイデアが1日1件「浮上」する機能です。忘れかけていたアイデアと再会するきっかけになります。",
  },
];

export default function LatentSupportPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#3d3833]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#8a8378]">Latent</p>
        <h1 className="text-2xl font-semibold tracking-wide">Latent サポート</h1>
        <p className="mt-6 text-[15px]">
          Latent
          は、思いついたアイデアを即座に記録し、時間の経過とともにアイデアが「冷めていく」メモアプリです。触れないアイデアは静かに薄れ、再び思い出したアイデアは色を取り戻します。
        </p>

        <h2 className="mt-12 text-base font-semibold tracking-wide">よくある質問</h2>
        <dl className="mt-4 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-[15px] font-semibold">Q. {f.q}</dt>
              <dd className="mt-1 text-[14.5px]">{f.a}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 text-base font-semibold tracking-wide">お問い合わせ</h2>
        <p className="mt-2 text-[15px]">
          不具合のご報告やご要望は、
          <Link className="text-[#a4551e] underline" href="/#contact">
            お問い合わせフォーム
          </Link>
          からお送りください。
        </p>

        <p className="mt-16 text-sm text-[#8a8378]">
          <Link className="underline" href="/latent/privacy">
            プライバシーポリシー
          </Link>
        </p>
      </main>
    </div>
  );
}
