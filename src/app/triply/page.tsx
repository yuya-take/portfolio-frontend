import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Triply サポート",
  description: "Triply は、旅の日記と支出を記録する iOS アプリです。サポート情報とよくある質問。",
};

const faqs = [
  {
    q: "ログインには何が必要ですか？",
    a: "Apple でサインインするか、Google アカウントでログインします。最初のログインでアカウントが作られます。メールアドレスとパスワードでの登録はありません。",
  },
  {
    q: "旅行はどう作りますか？",
    a: "ホームの右下の「＋」から作ります。旅行名、開始日と終了日、目的地（1 つ以上）を入力します。カバー写真と全体予算は任意です。",
  },
  {
    q: "日記や支出はどこから追加しますか？",
    a: "旅行の詳細を開き、タイムラインか予算のタブで右下のボタンを押すと、日記か支出を選べます。日記は日付・時刻・メモと写真（10 枚まで）、支出は金額・カテゴリ・日付・時刻・メモを記録します。",
  },
  {
    q: "予算はどこで設定しますか？",
    a: "旅行の詳細のサマリーにある「設定」（設定済みなら鉛筆のアイコン）か、予算のタブの「予算を編集」から、カテゴリごとに入力します。カテゴリの予算の合計に対して、使った額と残りが表示されます。",
  },
  {
    q: "場所はどう登録しますか？",
    a: "旅行の詳細のマップのタブで右下のボタンを押し、名前で検索して選びます。登録した場所は、その旅行の地図にピンで表示されます。",
  },
  {
    q: "日記や支出を、登録した場所に結びつけられますか？",
    a: "いまのところできません。場所は旅行の地図に登録するもので、日記や支出とは別に扱われます。",
  },
  {
    q: "通貨は選べますか？",
    a: "金額は日本円で記録します。通貨の切り替えや為替の換算はありません。",
  },
  {
    q: "オフラインでも使えますか？",
    a: "使えません。記録はサーバーに保存するので、読み込みと保存にはインターネット接続が必要です。",
  },
  {
    q: "機種を替えてもデータは残りますか？",
    a: "残ります。記録はアカウントに結びついてサーバーに保存されています。新しい端末で、これまでと同じ方法（Apple または Google）でログインしてください。",
  },
  {
    q: "旅行や記録を削除するには？",
    a: "旅行は、ホームでカードを左にスワイプするか、旅行の編集画面から削除できます。日記は詳細の画面か編集の画面、支出は編集の画面から削除します。削除したデータは元に戻せません。",
  },
  {
    q: "アカウントを削除するには？",
    a: "設定のタブの「アカウントを削除」から削除できます。旅行・予算・支出・日記・写真・場所のデータとアカウントがすべて削除され、元に戻せません。Apple でサインインしている場合は、削除の前にもう一度 Apple でサインインします。",
  },
  {
    q: "Android 版や iPad 版はありますか？",
    a: "ありません。iPhone 向けのアプリです。",
  },
];

export default function TriplySupportPage() {
  return (
    <div className="min-h-screen bg-[#F4FBF8] text-[#161D1C]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#6F7977]">Triply</p>
        <h1 className="text-2xl font-semibold tracking-wide">Triply サポート</h1>
        <p className="mt-6 text-[15px]">
          Triply は、旅の日記と支出を記録する iOS アプリです。旅行ごとに、日記（メモと写真）と支出を 1
          本のタイムラインに残し、予算に対する残りを確認できます。
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
          <Link className="text-[#006A60] underline" href="/#contact">
            お問い合わせフォーム
          </Link>
          からお送りください。
        </p>

        <p className="mt-16 text-sm text-[#6F7977]">
          <Link className="underline" href="/triply/privacy">
            プライバシーポリシー
          </Link>
        </p>
      </main>
    </div>
  );
}
