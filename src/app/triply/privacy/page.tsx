import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Triply",
  description:
    "Triply のプライバシーポリシー。Triply が扱う情報、保存先、利用している外部サービス、データの削除方法について。",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold tracking-wide">{title}</h2>
      <div className="mt-2 space-y-3 text-[14.5px]">{children}</div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-1 pl-5">{children}</ul>;
}

export default function TriplyPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F4FBF8] text-[#161D1C]">
      <main className="mx-auto max-w-2xl px-6 py-16 leading-loose">
        <p className="mb-10 text-xs tracking-[0.3em] text-[#6F7977]">Triply</p>

        <h1 className="text-2xl font-semibold tracking-wide">プライバシーポリシー</h1>
        <p className="mt-2 text-sm text-[#6F7977]">最終更新日: 2026年11月23日</p>

        <Section title="データの収集について">
          <p>
            Triply
            は、旅の日記と支出をアカウントに結びつけて、サーバーに保存するアプリです。そのために、次の情報を扱います。
          </p>
          <List>
            <li>
              アカウントの情報: Apple でサインインした場合はメールアドレス（「メールを非公開」を選んだ場合は、Apple
              が発行する転送用のアドレス）。Google でログインした場合はメールアドレス、名前、プロフィール画像の
              URL。どちらの場合も、ログインに使ったサービスが発行するユーザーの識別子。
            </li>
            <li>
              記録した内容:
              旅行（名前、期間、目的地、カバー写真、予算）、支出（金額、カテゴリ、日時、メモ）、日記（日時、メモ、写真）、登録した場所（名前、住所、位置）。
            </li>
            <li>
              写真:
              日記やカバーに付けるために、あなたが選んだ写真と、アプリから撮った写真だけを扱います。端末で縮小してから送信します。
            </li>
            <li>
              サーバーの動作記録: アカウントの識別子、行った操作の種類、日時など。通信に伴う IP
              アドレスなどの接続情報は、下記の事業者のサーバーで処理されます。
            </li>
          </List>
          <p>
            端末の位置情報、連絡先、広告用の識別子は取得しません。地図に表示するのは、あなたが名前で検索して登録した場所だけです。
          </p>
          <p>
            これらの情報は、記録の保存と表示、ログインといったアプリの機能の提供と、不具合の調査のためにだけ使います。下記の事業者に保存と処理を任せる場合を除いて、第三者に販売・提供することはありません。
          </p>
        </Section>
        <Section title="データの保存場所">
          <p>
            アカウントの情報と記録した内容は、Supabase と Amazon Web Services
            のサーバー（いずれも東京リージョン）に保存します。
          </p>
          <p>
            写真は、推測されにくい URL で保存します。この URL はアプリの中でだけ使い、外部には公開しません。ただし、URL
            を知っている人は、ログインせずにその写真を表示できます。
          </p>
          <p>
            ログインの状態は、端末のキーチェーンに保存します。ログアウトすると削除されます。表示を速くするために、写真を端末に一時的に保存することがあります。
          </p>
        </Section>
        <Section title="第三者サービス">
          <p>Triply は、次のサービスを利用しています。</p>
          <List>
            <li>Supabase: ログイン、記録のデータベース、写真の保存。</li>
            <li>Amazon Web Services: アプリと通信するサーバー。</li>
            <li>
              Google: Google でのログイン。場所の検索には Google Places API を使うため、検索欄に入力した文字が Google
              に送信されます。
            </li>
            <li>Apple: Apple でサインインと、地図の表示。</li>
            <li>Expo: アプリの更新の配信。起動時に、更新があるかを確かめる通信を行います。</li>
          </List>
          <p>広告・アクセス解析・トラッキングのためのサービスは利用していません。</p>
        </Section>
        <Section title="データの削除">
          <p>
            旅行、日記、支出、写真、場所は、アプリの中でいつでも削除できます。設定の「アカウントを削除」を行うと、これらのデータとアカウントがすべて削除されます。Apple
            でサインインしている場合は、Apple との連携もあわせて取り消します。削除したデータは元に戻せません。
          </p>
          <p>
            アプリをアンインストールしただけでは、サーバーのデータは削除されません。サーバーの動作記録は、一定の期間が過ぎると自動的に削除されます。
          </p>
        </Section>
        <Section title="ポリシーの変更">
          <p>本ポリシーを変更する場合は、本ページにて告知します。</p>
        </Section>
        <Section title="お問い合わせ">
          <p>
            本ポリシーに関するお問い合わせは、
            <Link className="text-[#006A60] underline" href="/#contact">
              お問い合わせフォーム
            </Link>
            からご連絡ください。
          </p>
        </Section>

        <hr className="mt-14 border-[#DAE5E1]" />

        <div className="text-[#3F4947]">
          <h1 className="mt-14 text-2xl font-semibold tracking-wide">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#6F7977]">Last updated: November 23, 2026</p>

          <Section title="Data Collection">
            <p>
              Triply stores your travel diary and expenses on a server, tied to your account. To do that, it handles the
              following information.
            </p>
            <List>
              <li>
                Account information: if you use Sign in with Apple, your email address (or the relay address Apple
                issues when you choose Hide My Email). If you sign in with Google, your email address, name, and profile
                picture URL. In both cases, the user identifier issued by the sign-in service.
              </li>
              <li>
                Content you record: trips (name, dates, destinations, cover photo, budgets), expenses (amount, category,
                date and time, memo), diary entries (date and time, note, photos), and places you add (name, address,
                location).
              </li>
              <li>
                Photos: only the photos you choose or take in the app for a diary entry or a trip cover. They are
                resized on your device before upload.
              </li>
              <li>
                Server logs: your account identifier, the kind of operation, and its time. Connection data such as your
                IP address is processed by the providers listed below.
              </li>
            </List>
            <p>
              Triply does not collect your device location, contacts, or advertising identifier. The map shows only the
              places you search for by name and add yourself.
            </p>
            <p>
              This information is used only to provide the app&apos;s features, such as saving and showing your records
              and signing you in, and to investigate problems. It is not sold or shared with third parties, other than
              the providers below that store and process it for the app.
            </p>
          </Section>
          <Section title="Data Storage">
            <p>
              Your account information and the content you record are stored on Supabase and Amazon Web Services
              servers, both in the Tokyo region.
            </p>
            <p>
              Photos are stored at URLs that are hard to guess. These URLs are used only inside the app and are not
              published. However, anyone who knows a photo&apos;s URL can view that photo without signing in.
            </p>
            <p>
              Your sign-in session is stored in the device keychain and is removed when you sign out. Photos may be
              cached on your device temporarily so that they load faster.
            </p>
          </Section>
          <Section title="Third-Party Services">
            <p>Triply uses the following services.</p>
            <List>
              <li>Supabase: sign-in, the database of your records, and photo storage.</li>
              <li>Amazon Web Services: the server the app talks to.</li>
              <li>
                Google: Sign in with Google. Place search uses the Google Places API, so the text you type in the search
                field is sent to Google.
              </li>
              <li>Apple: Sign in with Apple, and the map display.</li>
              <li>Expo: delivery of app updates. The app checks for an update when it starts.</li>
            </List>
            <p>Triply uses no advertising, analytics, or tracking services.</p>
          </Section>
          <Section title="Data Deletion">
            <p>
              You can delete trips, diary entries, expenses, photos, and places in the app at any time. Choosing Delete
              Account in Settings deletes all of this data together with your account. If you use Sign in with Apple,
              the connection with Apple is revoked as well. Deleted data cannot be restored.
            </p>
            <p>
              Uninstalling the app alone does not delete the data on the server. Server logs are deleted automatically
              after a set period.
            </p>
          </Section>
          <Section title="Changes to This Policy">
            <p>Changes to this policy will be announced on this page.</p>
          </Section>
          <Section title="Contact">
            <p>
              For questions about this policy, please reach out via the{" "}
              <Link className="text-[#006A60] underline" href="/#contact">
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>

        <p className="mt-16 text-sm text-[#6F7977]">
          <Link className="underline" href="/triply">
            サポートページへ戻る
          </Link>
        </p>
      </main>
    </div>
  );
}
