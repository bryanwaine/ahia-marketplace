import nodemailer from 'nodemailer';
import Welcome from './email_templates/welcome';
import VerifyEmail from './email_templates/verifyEmail';
import ResetPassword from './email_templates/resetPassword';
import ResetPasswordSuccess from './email_templates/resetPasswordSuccess';

const welcomeSubject = `Welcome to Ahia Marketplace!`;
const verifyEmailSubject = `Your Ahia Marketplace verification code`;
const resetPasswordSubject = `Reset your password`;
const resetPasswordSuccessSubject = `Your password has been reset successfully`;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  //   secure: true, // true for 465, false for other ports
  port: 465,
  auth: {
    user: process.env.NEXT_PUBLIC_USER_EMAIL,
    pass: process.env.NEXT_PUBLIC_USER_PASSWORD,
  },
});

const sendVerifyEmail = async (email, code) => {
  await transporter
    .sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: verifyEmailSubject,
      html: VerifyEmail(code),
    })
    .then(console.info)
    .catch((err) => {
      console.log(err);
    });
};

const sendWelcomeEmail = async (email, firstName) => {
  await transporter
    .sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: welcomeSubject,
      html: Welcome(firstName),
    })
    .then(console.info)
    .catch((err) => {
      console.log(err);
    });
};

const sendResetPasswordEmail = async (
  email,
  firstName,
  url,
  operating_system,
  browser_name
) => {
  await transporter
    .sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: resetPasswordSubject,
      html: ResetPassword(firstName, url, operating_system, browser_name),
    })
    .then(console.info)
    .catch((err) => {
      console.log(err);
    });
};

const sendResetPasswordSuccessEmail = async (email, firstName) => {
  await transporter
    .sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: resetPasswordSuccessSubject,
      html: ResetPasswordSuccess(firstName),
    })
    .then(console.info)
    .catch((err) => {
      console.log(err);
    });
};

export {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
