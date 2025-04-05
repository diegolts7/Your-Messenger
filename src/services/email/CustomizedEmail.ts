import { EmailService } from "./EmailService";

export const sendMailCodeOtp = async (to: string, code: string) => {
  const subject = "Seu código de verificação OTP";

  const text = `Olá,\n\nSeu código de verificação OTP é: ${code}.\n\nEle expira em 3 minutos. Não compartilhe este código com ninguém.\n\nSe você não solicitou este código, ignore este e-mail.\n\nAtenciosamente,\nEquipe You Messenger`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificação</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        .logo {
            color: #333333;
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
        .code-container {
            margin: 25px 0;
            text-align: center;
        }
        .otp-code {
            display: inline-block;
            font-size: 28px;
            letter-spacing: 3px;
            padding: 15px 25px;
            background-color: #f5f5f5;
            border-radius: 6px;
            color: #333333;
            font-weight: 300;
        }
        .divider {
            height: 1px;
            background-color: #eeeeee;
            margin: 25px 0;
        }
        .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
        }
        .warning {
            font-size: 14px;
            color: #666666;
            text-align: center;
            margin: 20px 0;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">You Messenger</div>
        </div>
        
        <p style="text-align: center;">Seu código de verificação é:</p>
        
        <div class="code-container">
            <div class="otp-code">${code}</div>
        </div>
        
        <p style="text-align: center; font-size: 14px; color: #666666;">
            Utilize este código para completar sua verificação.<br>
            O código expira em <strong>3 minutos</strong>.
        </p>
        
        <div class="warning">
            Por segurança, não compartilhe este código com outras pessoas.
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
            Se você não solicitou este código, por favor ignore este e-mail.<br>
            © ${new Date().getFullYear()} You Messenger. Todos os direitos reservados.
        </div>
    </div>
</body>
</html>
`;

  return await EmailService.sendEmail(to, subject, html, text);
};
