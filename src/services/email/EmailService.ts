import { transporter } from "../../config/nodemailer/transporter";

export class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
    replyTo?: string
  ) {
    return await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
      replyTo,
    });
  }
}
