import nodeMailjet from 'node-mailjet';
import Welcome from './email_templates/welcome';
import VerifyEmail from './email_templates/verifyEmail';
import ResetPassword from './email_templates/resetPassword';
import ResetPasswordSuccess from './email_templates/resetPasswordSuccess';

const welcomeSubject = `Welcome to Ahia Marketplace!`;
const verifyEmailSubject = `Your Ahia Marketplace verification code`;
const resetPasswordSubject = `Reset your password`;
const resetPasswordSuccessSubject = `Your password has been reset successfully`;

const mailjet = nodeMailjet.connect(
  process.env.NEXT_PUBLIC_MAILJET_API_KEY,
  process.env.NEXT_PUBLIC_MAILJET_SECRET_KEY
);

const sendVerifyEmail = (email, firstName, code) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'ahia.marketplace.ng@gmail.com',
          Name: 'Ahia Marketplace',
        },
        To: [
          {
            Email: email,
            Name: firstName,
          },
        ],
        Subject: verifyEmailSubject,
        TextPart: '',
        HTMLPart: VerifyEmail(code),
        CustomID: 'Ahia Marketplace',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const sendWelcomeEmail =  (email, firstName) => {
 const request =  mailjet.post('send', { version: 'v3.1' })
    .request({
    Messages: [
      {
        From: {
          Email: 'ahia.marketplace.ng@gmail.com',
          Name: 'Ahia Marketplace',
        },
        To: [
          {
            Email: email,
            Name: firstName,
          },
        ],
        Subject: welcomeSubject,
        TextPart: '',
        HTMLPart: Welcome(firstName),
        CustomID: 'Ahia Marketplace',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const sendResetPasswordEmail = async (
  email,
  firstName,
  url,
  operating_system,
  browser_name
) => {
  const request = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'ahia.marketplace.ng@gmail.com',
          Name: 'Ahia Marketplace',
        },
        To: [
          {
            Email: email,
            Name: firstName,
          },
        ],
        Subject: resetPasswordSubject,
        TextPart: '',
        HTMLPart: ResetPassword(firstName, url, operating_system, browser_name),
        CustomID: 'Ahia Marketplace',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

const sendResetPasswordSuccessEmail = async (
  email,
  firstName
) => {
  const request = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'ahia.marketplace.ng@gmail.com',
          Name: 'Ahia Marketplace',
        },
        To: [
          {
            Email: email,
            Name: firstName,
          },
        ],
        Subject: resetPasswordSuccessSubject,
        TextPart: '',
        HTMLPart: ResetPasswordSuccess(firstName),
        CustomID: 'Ahia Marketplace',
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};

export {
  sendVerifyEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetPasswordSuccessEmail,
};
