import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_XX4DNGxa_MWEU9ATPBbgNyW64xgEQ433o'); 

export async function POST(req: Request) {
  const { email, name, gigTitle } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'StartupConnect <onboarding@resend.dev>', 
      to: email,
      subject: "Congratulations! You've been hired! 🎉",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Hi ${name},</h2>
          <p>Great news! Your application for <strong>${gigTitle}</strong> has been accepted.</p>
          <p>The startup is excited to work with you. Click the button below to jump into the chat and discuss the next steps.</p>
          <a href="https://yourplatform.com/chat" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Start Chatting Now</a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Best regards,<br>StartupConnect Team</p>
        </div>
      `
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}