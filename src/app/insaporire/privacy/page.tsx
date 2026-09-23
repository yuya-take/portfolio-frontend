import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Insaporire",
  description:
    "Insaporire のプライバシーポリシー。Insaporire はいかなる個人情報・利用データも収集せず、レシピはすべて端末内にのみ保存されます。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold tracking-wide">{title}</h2>
      <div className="mt-2 text-[14.5px]">{children}</div>
    </section>
  );
}

export default function InsaporirePrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6F1E8] text-[#1F1B16]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#5C554B]">Insaporire</p>

        <h1 className="text-2xl font-semibold tracking-wide">プライバシーポリシー</h1>
        <p className="mt-2 text-sm text-[#5C554B]">最終更新日: 2026年9月23日</p>

        <Section title="データの収集について">
          <p>Insaporire は、いかなる個人情報・利用データも収集しません。</p>
        </Section>
        <Section title="データの保存場所">
          <p>
            登録したレシピ・各バージョンの材料・手順・気づき・評価は、すべてお使いの端末内にのみ保存されます。開発者のサーバーや第三者のサーバーに送信されることはありません。アカウントの登録も必要ありません。
          </p>
        </Section>
        <Section title="アプリの更新について">
          <p>
            起動時に、アプリの表示や動作を更新するための配信サーバー（Expo Application
            Services）へ接続し、更新の有無を確認します。この通信に含まれるのは、アプリのバージョン、OS
            の種類、インストールごとにランダムに生成される識別子など、更新の判定に必要な情報だけです。レシピの内容や氏名・メールアドレスなどの個人情報は含まれません。
          </p>
        </Section>
        <Section title="第三者サービス">
          <p>Insaporire は、広告・アクセス解析・トラッキング等の第三者サービスを一切利用していません。</p>
        </Section>
        <Section title="データの削除">
          <p>
            レシピやバージョンはアプリ内でいつでも削除できます。アプリをアンインストールすると、端末内のすべてのデータが削除されます。バックアップや同期の機能は持たないため、削除したデータは元に戻せません。
          </p>
        </Section>
        <Section title="ポリシーの変更">
          <p>本ポリシーを変更する場合は、本ページにて告知します。</p>
        </Section>
        <Section title="お問い合わせ">
          <p>
            本ポリシーに関するお問い合わせは、
            <Link className="text-[#8A3F1F] underline" href="/#contact">
              お問い合わせフォーム
            </Link>
            からご連絡ください。
          </p>
        </Section>

        <hr className="mt-14 border-[#E6DFD2]" />

        <div className="text-[#3A342C]">
          <h1 className="mt-14 text-2xl font-semibold tracking-wide">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#5C554B]">Last updated: September 23, 2026</p>

          <Section title="Data Collection">
            <p>Insaporire does not collect any personal information or usage data.</p>
          </Section>
          <Section title="Data Storage">
            <p>
              Your recipes and every version&apos;s ingredients, steps, notes, and ratings are stored only on your
              device. Nothing is ever transmitted to the developer or any third-party server, and no account is
              required.
            </p>
          </Section>
          <Section title="App Updates">
            <p>
              On launch, the app contacts the update server (Expo Application Services) to check for a newer version of
              its interface and behavior. That request carries only what is needed to decide whether an update applies:
              the app version, the operating system, and a random identifier generated per installation. It never
              includes your recipes or any personal information such as your name or email address.
            </p>
          </Section>
          <Section title="Third-Party Services">
            <p>Insaporire uses no advertising, analytics, or tracking services.</p>
          </Section>
          <Section title="Data Deletion">
            <p>
              You can delete any recipe or version within the app at any time. Uninstalling the app removes all data
              from your device. Insaporire has no backup or sync, so deleted data cannot be restored.
            </p>
          </Section>
          <Section title="Contact">
            <p>
              For questions about this policy, please reach out via the{" "}
              <Link className="text-[#8A3F1F] underline" href="/#contact">
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>

        <p className="mt-16 text-sm text-[#5C554B]">
          <Link className="underline" href="/insaporire">
            サポートページへ戻る
          </Link>
        </p>
      </main>
    </div>
  );
}
