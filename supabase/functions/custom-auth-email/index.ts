import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string).replace(
  "v1,whsec_",
  ""
);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";

interface EmailPayload {
  user: {
    email: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

function getConfirmationUrl(
  tokenHash: string,
  type: string,
  redirectTo: string
): string {
  return `${SUPABASE_URL}/auth/v1/verify?token=${tokenHash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo)}`;
}

function buildSignupEmail(confirmationUrl: string): { subject: string; html: string } {
  return {
    subject: "Подтверждение регистрации — СГКБ №5",
    html: `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#2563eb;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">СГКБ №5</h1>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;">Подтверждение регистрации</h2>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Вы зарегистрировались на сайте Саратовской городской клинической больницы №5. Для подтверждения вашего email-адреса нажмите на кнопку ниже:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
            <a href="${confirmationUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:bold;">
              Подтвердить email
            </a>
          </td></tr></table>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
            Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

function buildRecoveryEmail(confirmationUrl: string): { subject: string; html: string } {
  return {
    subject: "Сброс пароля — СГКБ №5",
    html: `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#2563eb;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">СГКБ №5</h1>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;">Сброс пароля</h2>
          <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;">
            Мы получили запрос на сброс пароля для вашей учётной записи. Нажмите на кнопку ниже, чтобы установить новый пароль:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 24px;">
            <a href="${confirmationUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:bold;">
              Сбросить пароль
            </a>
          </td></tr></table>
          <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;line-height:1.5;">
            Ссылка действительна в течение 24 часов.
          </p>
          <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;">
            Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("not allowed", { status: 400 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);

  try {
    const { user, email_data } = wh.verify(payload, headers) as EmailPayload;

    const { token_hash, redirect_to, email_action_type } = email_data;

    let type: string;
    let emailContent: { subject: string; html: string };

    switch (email_action_type) {
      case "signup":
        type = "signup";
        emailContent = buildSignupEmail(
          getConfirmationUrl(token_hash, type, redirect_to)
        );
        break;
      case "recovery":
        type = "recovery";
        emailContent = buildRecoveryEmail(
          getConfirmationUrl(token_hash, type, redirect_to)
        );
        break;
      case "magic_link":
        type = "magiclink";
        emailContent = buildSignupEmail(
          getConfirmationUrl(token_hash, type, redirect_to)
        );
        break;
      case "email_change":
        type = "email_change";
        emailContent = {
          subject: "Подтверждение смены email — СГКБ №5",
          html: buildSignupEmail(
            getConfirmationUrl(token_hash, type, redirect_to)
          ).html,
        };
        break;
      default:
        type = email_action_type;
        emailContent = buildSignupEmail(
          getConfirmationUrl(token_hash, type, redirect_to)
        );
        break;
    }

    const { error } = await resend.emails.send({
      from: "СГКБ №5 <noreply@sgkb5sar.xyz>",
      to: [user.email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Auth email (${email_action_type}) sent to ${user.email}`);
  } catch (error) {
    console.error("Error in custom-auth-email hook:", error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: 500,
          message: `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
