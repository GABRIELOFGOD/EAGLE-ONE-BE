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

  async sendLoginMail(to: string, link: string, name: string) {
    const htmlContent = `
    <html>
      <body>
        <p>Hello ${name}<br> 
        Click on the link below to login to your YOUDOC account.</p>
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

  async sendForgotPasswordMail(to: string, name: string, link: string) {
    const htmlContent = `
    <html>
      <body>
        <p>Hello ${name}</p>
        <p>You requested for a reset password link, click on the button below to reset your password</p><br>
        <a href="${link}" style="display: inline-block; padding: 10px 30px; border-radius: 10px; background-color: black; color: white; text-decoration: none;">Reset password</a><br>
        <p>Copy the link below and paste to your browser if the button above does not work</p><br>
        <p style="word-wrap: break-word;"><a href="${link}">${link}</a></p>
        <p>Please know that this link will expire after 5 minutes</p><br>
        <small>Kindly ignore this message if you do not request for a reset password link.</small>
      </body>
    </html>
    `;

    const info = await this.transporter.sendMail({
        from: 'aletechglobal@gmail.com',
        to,
        subject: "Reset Password",
        html: htmlContent
    });

    console.log('Message sent: %s', info.messageId);
  }



  
}
