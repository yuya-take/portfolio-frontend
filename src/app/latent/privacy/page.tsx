import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Latent",
  description:
    "Latent のプライバシーポリシー。Latent はいかなる個人情報・利用データも収集せず、すべてのデータは端末内にのみ保存されます。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold tracking-wide">{title}</h2>
      <div className="mt-2 text-[14.5px]">{children}</div>
    </section>
  );
}

export default function LatentPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#3d3833]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#8a8378]">Latent</p>

        <h1 className="text-2xl font-semibold tracking-wide">プライバシーポリシー</h1>
        <p className="mt-2 text-sm text-[#8a8378]">最終更新日: 2026年9月17日</p>

        <Section title="データの収集について">
          <p>Latent は、いかなる個人情報・利用データも収集しません。</p>
        </Section>
        <Section title="データの保存場所">
          <p>
            アプリに記録したアイデアおよび設定は、すべてお使いの端末内（ローカルデータベース）にのみ保存されます。開発者のサーバーや第三者のサーバーに送信されることはありません。
          </p>
        </Section>
        <Section title="第三者サービス">
          <p>
            Latent
            は、広告・アクセス解析・トラッキング等の第三者サービスを一切利用していません。アカウント登録も不要です。
          </p>
        </Section>
        <Section title="データの削除">
          <p>
            記録したアイデアはアプリ内でいつでも削除できます。アプリをアンインストールすると、端末内のすべてのデータが削除されます。
          </p>
        </Section>
        <Section title="ポリシーの変更">
          <p>本ポリシーを変更する場合は、本ページにて告知します。</p>
        </Section>
        <Section title="お問い合わせ">
          <p>
            本ポリシーに関するお問い合わせは、
            <Link className="text-[#a4551e] underline" href="/#contact">
              お問い合わせフォーム
            </Link>
            からご連絡ください。
          </p>
        </Section>

        <hr className="mt-14 border-[#e2ddd3]" />

        <div className="text-[#6b655c]">
          <h1 className="mt-14 text-2xl font-semibold tracking-wide">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#8a8378]">Last updated: September 17, 2026</p>

          <Section title="Data Collection">
            <p>Latent does not collect any personal information or usage data.</p>
          </Section>
          <Section title="Data Storage">
            <p>
              All ideas and settings you record are stored only in a local database on your device. Nothing is ever
              transmitted to the developer or any third-party server.
            </p>
          </Section>
          <Section title="Third-Party Services">
            <p>Latent uses no advertising, analytics, or tracking services. No account is required.</p>
          </Section>
          <Section title="Data Deletion">
            <p>
              You can delete any idea within the app at any time. Uninstalling the app removes all data from your
              device.
            </p>
          </Section>
          <Section title="Contact">
            <p>
              For questions about this policy, please reach out via the{" "}
              <Link className="text-[#a4551e] underline" href="/#contact">
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>

        <p className="mt-16 text-sm text-[#8a8378]">
          <Link className="underline" href="/latent">
            サポートページへ戻る
          </Link>
        </p>
      </main>
    </div>
  );
}
