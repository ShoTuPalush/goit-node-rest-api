import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const { PASSWORD_META } = process.env;

export const sendEmail = async ({ to, subject, html, text = '' }) => {
  const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: 'nodejsgoittest@meta.ua',
      pass: PASSWORD_META,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const email = {
    from: 'nodejsgoittest@meta.ua',
    to,
    subject,
    html,
    text,
  };
  // const transport = nodemailer.createTransport({
  //   host: 'sandbox.smtp.mailtrap.io',
  //   port: 2525,
  //   auth: {
  //     user: 'f5345ea708e366',
  //     pass: 'f2cca05b6879bd',
  //   },
  // });

  await transporter.sendMail(email);
};
