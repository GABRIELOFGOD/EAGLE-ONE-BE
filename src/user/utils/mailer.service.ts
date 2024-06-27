import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'aletechglobal@gmail.com',
          pass: process.env.GOOGLE_EMAIL_AUTH
      }
    });
  }

  // async sendRegistrationMail(to: string, link: string) {
  //   const info = await this.transporter.sendMail({
  //     from: 'aletechglobal@gmail.com',
  //     to,
  //     subject: "Welcome to YOUDOC",
  //     html: `<html>
  //       <p>Thank you for your registration, We are your closest doctor 😊 <br> Here's to confirm your email address, kindly click on the button below to complete your profile in our mobile app</p>
  //       <button style="padding: 10px 30px; border-radius: 10px; background: black; color: white;"><a href="${link}">Continue in app</a></button> <br>
  //       <p>You can copy the link below and paste in you browser as well <br> ${link}</p>
  //     </html>`, // plain text body
  //   });

  //   console.log('Message sent: %s', info.messageId);
  // }

  async sendRegistrationMail(to: string, link: string) {
    const htmlContent = `
    <html>
      <body>
        <p>Thank you for your registration, We are your closest doctor 😊<br> 
        Here's to confirm your email address, kindly click on the button below to complete your profile in our mobile app:</p>
        <a href="${link}" style="display: inline-block; padding: 10px 30px; border-radius: 10px; background-color: black; color: white; text-decoration: none;">Continue in app</a><br><br>
        <p>If the button above does not work, copy and paste the following link into your browser:</p>
        <p style="word-wrap: break-word;"><a href="${link}">${link}</a></p>
      </body>
    </html>
    `;

    const info = await this.transporter.sendMail({
        from: 'aletechglobal@gmail.com',
        to,
        subject: "Welcome to YOUDOC",
        html: htmlContent
    });

    console.log('Message sent: %s', info.messageId);
  }



  
}
