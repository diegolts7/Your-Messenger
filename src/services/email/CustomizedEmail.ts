import { EmailService } from "./EmailService";

export const sendMailCodeOtp = async (to: string, code: string) => {
  const subject = "Seu código de verificação OTP";

  const text = `Olá,\n\nSeu código de verificação OTP é: ${code}.\n\nEle expira em 3 minutos. Não compartilhe este código com ninguém.\n\nSe você não solicitou este código, ignore este e-mail.\n\nAtenciosamente,\nEquipe You Messenger`;

  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
      <h2 style="color: #4CAF50;">Código de Verificação</h2>
      <p>Seu código OTP é:</p>
      <h1 style="font-size: 28px; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${code}</h1>
      <p><strong>O código expira em 3 minutos.</strong></p>
      <p style="color: red;">Não compartilhe este código com ninguém.</p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #555;">Se você não solicitou este código, ignore este e-mail.</p>
      <p><strong>Equipe You Messenger</strong></p>
    </div>
  `;

  return await EmailService.sendEmail(to, subject, html, text);
};
