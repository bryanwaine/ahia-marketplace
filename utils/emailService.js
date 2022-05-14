// import nodeMailjet from 'node-mailjet';
import nodemailer from 'nodemailer';
// import { google } from 'googleapis';
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

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.NEXT_PUBLIC_CLIENT_ID,
//   process.env.NEXT_PUBLIC_CLIENT_SECRET,
//   process.env.NEXT_PUBLIC_REDIRECT_URI
// );
// oAuth2Client.setCredentials({
//   refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN,
// });

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: '0Auth2',
//     user: process.env.NEXT_PUBLIC_USER_EMAIL,
//     clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//     clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
//     refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN,
//     accessToken: oAuth2Client.getAccessToken(),
//   },
// });

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


// const mailjet = nodeMailjet.connect(
//   process.env.NEXT_PUBLIC_MAILJET_API_KEY,
//   process.env.NEXT_PUBLIC_MAILJET_SECRET_KEY
// );

// const sendVerifyEmail = (email, firstName, code) => {
//   const request = mailjet.post('send', { version: 'v3.1' }).request({
//     Messages: [
//       {
//         From: {
//           Email: 'ahia.marketplace.ng@gmail.com',
//           Name: 'Ahia Marketplace',
//         },
//         To: [
//           {
//             Email: email,
//             Name: firstName,
//           },
//         ],
//         Subject: verifyEmailSubject,
//         TextPart: '',
//         HTMLPart: VerifyEmail(code),
//         CustomID: 'Ahia Marketplace',
//       },
//     ],
//   });
//   request
//     .then((result) => {
//       console.log(result.body);
//     })
//     .catch((err) => {
//       console.log(err.statusCode);
//     });
// };

// const sendWelcomeEmail =  (email, firstName) => {
//  const request =  mailjet.post('send', { version: 'v3.1' })
//     .request({
//     Messages: [
//       {
//         From: {
//           Email: 'ahia.marketplace.ng@gmail.com',
//           Name: 'Ahia Marketplace',
//         },
//         To: [
//           {
//             Email: email,
//             Name: firstName,
//           },
//         ],
//         Subject: welcomeSubject,
//         TextPart: '',
//         HTMLPart: Welcome(firstName),
//         CustomID: 'Ahia Marketplace',
//       },
//     ],
//   });
//   request
//     .then((result) => {
//       console.log(result.body);
//     })
//     .catch((err) => {
//       console.log(err.statusCode);
//     });
// };

// const sendResetPasswordEmail = async (
//   email,
//   firstName,
//   url,
//   operating_system,
//   browser_name
// ) => {
//   const request = await mailjet.post('send', { version: 'v3.1' }).request({
//     Messages: [
//       {
//         From: {
//           Email: 'ahia.marketplace.ng@gmail.com',
//           Name: 'Ahia Marketplace',
//         },
//         To: [
//           {
//             Email: email,
//             Name: firstName,
//           },
//         ],
//         Subject: resetPasswordSubject,
//         TextPart: '',
//         HTMLPart: ResetPassword(firstName, url, operating_system, browser_name),
//         CustomID: 'Ahia Marketplace',
//       },
//     ],
//   });
//   request
//     .then((result) => {
//       console.log(result.body);
//     })
//     .catch((err) => {
//       console.log(err.statusCode);
//     });
// };

// const sendResetPasswordSuccessEmail = async (
//   email,
//   firstName
// ) => {
//   const request = await mailjet.post('send', { version: 'v3.1' }).request({
//     Messages: [
//       {
//         From: {
//           Email: 'ahia.marketplace.ng@gmail.com',
//           Name: 'Ahia Marketplace',
//         },
//         To: [
//           {
//             Email: email,
//             Name: firstName,
//           },
//         ],
//         Subject: resetPasswordSuccessSubject,
//         TextPart: '',
//         HTMLPart: ResetPasswordSuccess(firstName),
//         CustomID: 'Ahia Marketplace',
//       },
//     ],
//   });
//   request
//     .then((result) => {
//       console.log(result.body);
//     })
//     .catch((err) => {
//       console.log(err.statusCode);
//     });
// };

export {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
