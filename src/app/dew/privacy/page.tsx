import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Dew",
  description:
    "Dew のプライバシーポリシー。Dew はいかなる個人情報・利用データも収集せず、すべてのデータは端末内にのみ保存されます。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold tracking-wide">{title}</h2>
      <div className="mt-2 text-[14.5px]">{children}</div>
    </section>
  );
}

export default function DewPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1F1D1A]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#85806F]">Dew</p>

        <h1 className="text-2xl font-semibold tracking-wide">プライバシーポリシー</h1>
        <p className="mt-2 text-sm text-[#85806F]">最終更新日: 2026年11月23日</p>

        <Section title="データの収集について">
          <p>Dew は、いかなる個人情報・利用データも収集しません。</p>
        </Section>
        <Section title="データの保存場所">
          <p>
            登録した株・水やりの記録・設定は、すべてお使いの端末内にのみ保存されます。これらのデータが開発者や第三者のサーバーに送信されることはありません。アカウントの登録も必要ありません。
          </p>
        </Section>
        <Section title="通知について">
          <p>
            毎朝のおしらせは端末の中だけで予約されるローカル通知です。通知のために端末を識別する情報を発行したり、外部へ送信したりすることはありません。
          </p>
        </Section>
        <Section title="アプリの更新の確認">
          <p>
            Dew は起動時に、アプリの更新（不具合の修正など）があるかを、Expo 社のサービス（EAS
            Update）のサーバーに問い合わせます。このとき、インストールごとにランダムに作られる識別子、アプリのバージョン、OS
            の種類が送られます。前回の起動時にアプリが異常終了していた場合は、そのエラーの内容が含まれることがあります。登録した株・水やりの記録・設定は送られません。
          </p>
        </Section>
        <Section title="第三者サービス">
          <p>
            広告・アクセス解析・トラッキングのサービスは利用していません。アプリの更新の配信に Expo 社の EAS Update
            を利用しています。
          </p>
        </Section>
        <Section title="データの削除">
          <p>
            記録や株はアプリ内でいつでも削除できます。アプリをアンインストールすると、端末内のすべてのデータが削除されます。バックアップや同期の機能は持たないため、削除したデータは元に戻せません。
          </p>
        </Section>
        <Section title="ポリシーの変更">
          <p>本ポリシーを変更する場合は、本ページにて告知します。</p>
        </Section>
        <Section title="お問い合わせ">
          <p>
            本ポリシーに関するお問い合わせは、
            <Link className="text-[#3D5A45] underline" href="/#contact">
              お問い合わせフォーム
            </Link>
            からご連絡ください。
          </p>
        </Section>

        <hr className="mt-14 border-[#EAE5DA]" />

        <div className="text-[#4A463E]">
          <h1 className="mt-14 text-2xl font-semibold tracking-wide">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#85806F]">Last updated: November 23, 2026</p>

          <Section title="Data Collection">
            <p>Dew does not collect any personal information or usage data.</p>
          </Section>
          <Section title="Data Storage">
            <p>
              The plants you add, your watering records, and your settings are stored only on your device. This data is
              never transmitted to the developer or any third-party server, and no account is required.
            </p>
          </Section>
          <Section title="Notifications">
            <p>
              The morning reminder is a local notification scheduled on your device. No device token or identifier is
              created or sent anywhere for it.
            </p>
          </Section>
          <Section title="App Update Checks">
            <p>
              When Dew starts, it checks Expo&apos;s update service (EAS Update) for app updates such as bug fixes. This
              request includes a random identifier generated for each installation, the app version, and the OS type. If
              the app crashed during its previous launch, the request may also include that error message. Your plants,
              watering records, and settings are never sent.
            </p>
          </Section>
          <Section title="Third-Party Services">
            <p>
              Dew uses no advertising, analytics, or tracking services. It uses Expo&apos;s EAS Update to deliver app
              updates.
            </p>
          </Section>
          <Section title="Data Deletion">
            <p>
              You can delete any record or plant within the app at any time. Uninstalling the app removes all data from
              your device. Dew has no backup or sync, so deleted data cannot be restored.
            </p>
          </Section>
          <Section title="Contact">
            <p>
              For questions about this policy, please reach out via the{" "}
              <Link className="text-[#3D5A45] underline" href="/#contact">
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>

        <p className="mt-16 text-sm text-[#85806F]">
          <Link className="underline" href="/dew">
            サポートページへ戻る
          </Link>
        </p>
      </main>
    </div>
  );
}
