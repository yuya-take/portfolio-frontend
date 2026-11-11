"use client";

import { useEffect, useState } from "react";

/** Google フォームの埋め込み。押すまで読み込まない。/#contact で来たときは最初から開く。 */
export function ContactForm({ src }: { src: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#contact") setOpen(true);
  }, []);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="contact-form"
        onClick={() => setOpen((value) => !value)}
        className="border border-white/60 px-6 py-3 leading-normal transition-colors duration-300 hover:bg-white hover:text-ink"
      >
        {open ? "フォームを閉じる" : "お問い合わせフォームを開く"}
      </button>
      <div id="contact-form" hidden={!open} className="mt-6 bg-white">
        {open && <iframe src={src} title="お問い合わせフォーム" className="block h-[720px] w-full" />}
      </div>
    </div>
  );
}
