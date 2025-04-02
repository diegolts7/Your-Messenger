import { transporter } from "../../config/nodemailer/transporter";

export class EmailService {
  static async sendEmail(to: string, subject: string, text: string) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  }
}
