import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dew サポート",
  description:
    "Dew は、鉢植えのハーブ・野菜の水やりを記録から学習して知らせる iOS アプリです。サポート情報とよくある質問。",
};

const faqs = [
  {
    q: "水やりの間隔はどこで設定しますか？",
    a: "設定する場所はありません。図鑑が持つ株ごとの目安から始まり、あなたの記録と土の回答から間隔を学習していきます。季節による伸び縮みも自動で補正されます。",
  },
  {
    q: "記録のあとに出る土の質問には必ず答えないといけませんか？",
    a: "いいえ。答えなくても水やりの記録は残ります。答えた回だけが学習に使われます。",
  },
  {
    q: "「カラカラだった／ちょうど乾いてた／まだ湿ってた」はどう選べばいいですか？",
    a: "鉢を持ったときの重さと、土の表面と中の湿り具合で選んでください。それぞれ「水やりが遅すぎた／ちょうどよかった／早すぎた」という意味です。迷ったら「ちょうど乾いてた」で構いません。",
  },
  {
    q: "通知はいつ届きますか？",
    a: "毎朝1回（既定は8:00、設定で変えられます）。その日に水やりする株が無ければ鳴りません。端末の中だけで動く通知なので、インターネットに接続していなくても届きます。",
  },
  {
    q: "「今日雨が降った」を押すとどうなりますか？",
    a: "屋外に置いている株すべてに、その日の雨を記録します。押したあとに出る一行から、同じ単位で取り消せます。雨は量が分からないので、雨のあとの「乾いていた」は学習に控えめに反映されます。",
  },
  {
    q: "間違えて記録してしまいました。",
    a: "株の詳細画面で、いちばん新しい記録を取り消せます。そのとき学習した間隔も記録前の値に戻ります。",
  },
  {
    q: "学習した間隔が実感と合いません。",
    a: "株の詳細画面の「学習をやり直す」で、図鑑の初期値からやり直せます。これまでの記録は消えません。鉢を替えたときや株が大きく育ったときにもお使いください。",
  },
  {
    q: "図鑑にない植物は登録できますか？",
    a: "図鑑で名前を絞り込んで結果が0件になると、「図鑑にない植物」として登録できます。水やりの間隔は同じように記録から学習します。植え時は出しません。",
  },
  {
    q: "植え時や収穫の時期は、どの地域のものですか？",
    a: "設定の地域区分（寒地／中間地／暖地）で切り替わります。出典を確認できた種・作型だけを載せているので、空欄の種もあります。",
  },
  {
    q: "記録のバックアップはできますか？",
    a: "いまのところできません。記録は端末の中にだけ保存され、アプリを削除すると一緒に消えます。",
  },
];

export default function DewSupportPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1F1D1A]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#85806F]">Dew</p>
        <h1 className="text-2xl font-semibold tracking-wide">Dew サポート</h1>
        <p className="mt-6 text-[15px]">
          Dew は、鉢植えのハーブ・野菜の水やりを管理する iOS
          アプリです。水やりの間隔を設定する欄はありません。「水をあげたら1タップ」の記録から株ごとの間隔を学習し、季節で自動的に補正します。
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
          <Link className="text-[#3D5A45] underline" href="/#contact">
            お問い合わせフォーム
          </Link>
          からお送りください。
        </p>

        <p className="mt-16 text-sm text-[#85806F]">
          <Link className="underline" href="/dew/privacy">
            プライバシーポリシー
          </Link>
        </p>
      </main>
    </div>
  );
}
