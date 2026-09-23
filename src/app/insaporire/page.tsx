import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insaporire サポート",
  description:
    "Insaporire は、料理の試作をバージョンとして重ね、前回との違いと気づきを残す iOS アプリです。サポート情報とよくある質問。",
};

const faqs = [
  {
    q: "「バージョン」とは何ですか？",
    a: "同じ料理を作り直した 1 回分の記録です。レシピ詳細の「追記」から、材料・手順・前回との違い・その日の条件・気づきを v2、v3 と重ねていきます。作り直さない料理は v1 のままで構いません。普通のレシピノートとしても使えます。",
  },
  {
    q: "保存したバージョンの材料や手順を直せますか？",
    a: "材料と手順は履歴として残すので、保存後は直せません。気づき・その日の条件・評価は、食べた後でもバージョンカードの「…」から「振り返りを編集」で書き足せます。材料や手順を間違えて保存したときは、そのバージョンを削除して追記し直してください。最後の 1 つは削除できません（レシピごと削除できます）。",
  },
  {
    q: "料理名・カテゴリ・タグを直したい。",
    a: "レシピ詳細の右上「…」から「レシピを編集」を開いてください。料理名・カテゴリ・タグだけを直せます。各バージョンの中身は変わりません。",
  },
  {
    q: "比率（%）が表示されません。",
    a: "比率は「基準材料」を指定したバージョンでだけ表示します。追記の材料欄で見出しの右から基準材料（パンなら粉など）を指定すると、他の材料の比率を分量から自動で計算します。指定すると単位は g に固定されます。カレーや炒め物のように比率が要らない料理では、指定しなければ比率の欄は出ません。",
  },
  {
    q: "分量を 2 人前から 10 人前に換算したい。",
    a: "基準材料を指定したレシピでは、詳細画面から「スケール」を開けます。基準材料の分量を変えると、比率を保ったまま全材料の分量を計算し直します。表示上の計算なので、保存した分量は書き換わりません。",
  },
  {
    q: "バージョンを比べるには？",
    a: "レシピ詳細の「比較」で 2 つのバージョンを選ぶと、材料・比率・手順・条件・気づきを左右に並べて、違う箇所を強調して表示します。3 つ以上を同時に比べることはいまはできません。",
  },
  {
    q: "気づきは作った直後に書かないといけませんか？",
    a: "いいえ。追記は料理名だけでも保存できます。気づき・反省と、その日の条件・微調整は「振り返りを編集」から食べた後に書き足せます。",
  },
  {
    q: "レシピを探すには？",
    a: "一覧の上のカテゴリで絞り込むか、右上の検索から料理名・カテゴリ・タグで横断して探せます。",
  },
  {
    q: "写真は付けられますか？",
    a: "いまのところ付けられません。仕上がりの写真は今後の検討項目です。",
  },
  {
    q: "記録のバックアップや他の端末との同期はできますか？",
    a: "いまのところできません。記録は端末の中にだけ保存され、アプリを削除すると一緒に消えます。削除したレシピやバージョンも元に戻せません。",
  },
];

export default function InsaporireSupportPage() {
  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1B16]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#5C554B]">Insaporire</p>
        <h1 className="text-2xl font-semibold tracking-wide">Insaporire サポート</h1>
        <p className="mt-6 text-[15px]">
          Insaporire は、料理の試作を記録して振り返るための iOS
          アプリです。同じ料理を作り直すたびに新しいバージョンとして追記し、前回との違い・その日の条件・気づきを残します。基準材料を指定した料理では、比率の自動計算と分量の換算も使えます。
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
          <Link className="text-[#8A3F1F] underline" href="/#contact">
            お問い合わせフォーム
          </Link>
          からお送りください。
        </p>

        <p className="mt-16 text-sm text-[#5C554B]">
          <Link className="underline" href="/insaporire/privacy">
            プライバシーポリシー
          </Link>
        </p>
      </main>
    </div>
  );
}
