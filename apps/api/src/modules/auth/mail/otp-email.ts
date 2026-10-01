import type { Lang } from '../../../common/lang.decorator.js';
import type { MailMessage } from '../../../infrastructure/mail/mail.service.js';
import type { OtpPurpose } from '../entities/otp-code.entity.js';

const COPY = {
  vi: {
    REGISTER: { subject: 'Mã xác thực tài khoản UnYoWo', intro: 'Dùng mã dưới đây để xác thực email của bạn:' },
    RESET_PASSWORD: { subject: 'Mã đặt lại mật khẩu UnYoWo', intro: 'Dùng mã dưới đây để đặt lại mật khẩu:' },
    expires: (m: number) => `Mã có hiệu lực trong ${m} phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.`,
  },
  en: {
    REGISTER: { subject: 'Your UnYoWo verification code', intro: 'Use the code below to verify your email:' },
    RESET_PASSWORD: { subject: 'Your UnYoWo password reset code', intro: 'Use the code below to reset your password:' },
    expires: (m: number) => `The code expires in ${m} minutes. If you didn't request it, you can ignore this email.`,
  },
} as const;

export function buildOtpEmail(
  to: string,
  code: string,
  purpose: OtpPurpose,
  lang: Lang,
  ttlMinutes: number,
): MailMessage {
  const copy = COPY[lang];
  const { subject, intro } = copy[purpose];
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#302104">
      <h2 style="margin:0 0 16px">Un<span style="color:#fc6c26">Yo</span>Wo</h2>
      <p>${intro}</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;background:#fff4d6;padding:16px;text-align:center;border-radius:8px">${code}</p>
      <p style="color:#8a691f;font-size:13px">${copy.expires(ttlMinutes)}</p>
    </div>`;

  return { to, subject, html, text: `${intro} ${code}\n${copy.expires(ttlMinutes)}` };
}
