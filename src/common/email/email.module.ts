import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { EmailService } from "./email.service";

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'nozimaabdugapparova9@gmail.com',
                    pass: 'krszninpfrujvuyw'  // yangi App Password, bo'shliqsiz
                }
            },
            defaults: {
                from: '"GoldCRM" <nozimaabdugapparova9@gmail.com>'
            },
            template: {
                dir: join(process.cwd(), 'src', 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}