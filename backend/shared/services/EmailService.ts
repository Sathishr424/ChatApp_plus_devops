import { transporter } from "../config/mailer/connection";
import GroupRepository from "../repositories/GroupRepository";
import UserRepository from "../repositories/UserRepository";

class EmailService {
  private async sendMessage(recipientEmail: string, message: string, subject: string) {
    console.log("New mail send event:", recipientEmail, subject);
    const mailOptions = {
      from: `"SatChat" <${process.env.MAIL_USERNAME}>`, // Sender address
      to: recipientEmail, // Recipient address
      subject, // Email subject
      html: message, // Plain text body
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Mail sent successfully...");
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  private getMessageBody(from: string, to: string, is_group: boolean) {
    return `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
            
            <div style="padding: 24px; background: #18181b; color: #ffffff;">
              <h1 style="margin: 0; font-size: 22px;">
                💬 You have a new message
              </h1>
            </div>

            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #27272a;">
                Hi ${to},
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b;">
                ${is_group ? `Recieved a new message from <strong>${from}</strong> Group on SatChat.` : `<strong>${from}</strong> sent you a new message on SatChat.`}
              </p>

              <div style="padding: 16px; background: #f4f4f5; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #71717a;">
                  Open SatChat to read the message and reply.
                </p>
              </div>

              <a
                href="${process.env.CLIENT_URL}"
                style="
                  display: inline-block;
                  padding: 12px 24px;
                  background: #18181b;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  font-size: 14px;
                  font-weight: 600;
                "
              >
                Open SatChat
              </a>
            </div>

            <div style="padding: 20px 24px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                You're receiving this email because you have a new message on SatChat.
              </p>
            </div>

          </div>
        </body>
      </html>
    `
  }

  async sendNewMessageNotificationOneToOne(from_id: number, to_id: number, isUserOnline: (id: number) => Promise<boolean>) {
    const is_online = await isUserOnline(to_id);
    console.log(`New send message email to uesr online: ${is_online}`);
    if (!is_online) {
      const from = await UserRepository.getUser(from_id);
      const to = await UserRepository.getUser(to_id);

      await this.sendMessage(
        to.email,
        this.getMessageBody(from.username ?? "Unknown", to.username ?? "Unknown", false),
        `${from.username} sent you a new message`
      );
    }
  }

  async sendNewMessageNotificationGroup(user_id: number, group_id: number, isUserOnline: (id: number) => Promise<boolean>) {
    const group = await GroupRepository.getGroup(user_id, group_id);

    await Promise.all([...group.members ?? []].map(async (member) => {
      if (member.member_id == user_id || !member.member) return true;
      const is_member_online = await isUserOnline(member.member_id);
      if (!is_member_online) {
        await this.sendMessage(
          member.member.email,
          this.getMessageBody(group.name, member.member?.username ?? "Unknown", false),
          `Received a new message from ${group.name} on SatChat`
        );
      }
    }));
  }
}

export default new EmailService();
