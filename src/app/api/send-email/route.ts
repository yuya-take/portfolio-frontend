import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { title, email, content } = await request.json();

    // SMTPトランスポーターの作成
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // メールオプションの設定
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: `新しいお問い合わせ: ${title}`,
      text: `
        タイトル: ${title}
        メールアドレス: ${email}
        
        内容:
        ${content}
      `,
    };

    // メールの送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "メールが正常に送信されました" }, { status: 200 });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json({ message: "メールの送信に失敗しました" }, { status: 500 });
  }
}
