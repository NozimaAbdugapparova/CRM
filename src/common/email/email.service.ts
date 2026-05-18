import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private readonly mailerservice: MailerService) {}

    async sendEmail(email: string, login: string, password: string) {
        await this.mailerservice.sendMail({
            to: email,
            from: '"GoldCRM" <nozimaabdugapparova9@gmail.com>',
            subject: "GoldCRM - Kirish ma'lumotlari",
            template: 'index',
            context: {
                text: `login: ${login} and password: ${password}`
            }
        });
    }
}