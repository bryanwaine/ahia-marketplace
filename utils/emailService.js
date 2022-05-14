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
  port: 587,
  //   secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendVerifyEmail = async (email, code) => {
  try {
    const result = await transporter.sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: verifyEmailSubject,
      html: VerifyEmail(code),
    });
    return console.log(result);
  } catch (err) {
    return console.log(err);
  }
};

const sendWelcomeEmail = async (email, firstName) => {
  try {
    const result = await transporter.sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: welcomeSubject,
      html: Welcome(firstName),
    });
    return console.log(result);
  } catch (err) {
    return console.log(err);
  }
};

const sendResetPasswordEmail = async (
  email,
  firstName,
  url
) => {
  try {
    const result = await transporter.sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: resetPasswordSubject,
      html: ResetPassword(firstName, url),
    });
    return console.log(result);
  } catch (err) {
    return console.log(err);
  }
};

const sendResetPasswordSuccessEmail = async (email, firstName) => {
  try {
    const result = await transporter.sendMail({
      from: `'Ahia Marketplace' <ahia.marketplace.ng@gmail.com>`,
      to: email,
      subject: resetPasswordSuccessSubject,
      html: ResetPasswordSuccess(firstName),
    })
    return console.log(result)
  } catch (err) {
    return console.log(err);
  }
};

export {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
