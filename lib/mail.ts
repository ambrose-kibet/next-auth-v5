import sgMail from '@sendgrid/mail';
import exp from 'constants';
// als try sendGrid

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const sender = process.env.EMAIL_SENDER as string;
const domain = process.env.DOMAIN as string;

export const sendVerificationEmail = async (
  /**
   * @param email  - The email address to send the verification email to
   * @type {string}
   */
  email: string,
  /**
   * @param token - The verification token to include in the email
   * @type {string}
   */
  token: string,
  /**
   * @param name - The name of the user to include in the email
   * @type {string}
   */
  name: string
) => {
  const msg = {
    to: email,
    from: sender,
    subject: 'Verify your email',
    html: `
    <h4>Hi ${name},</h4>
    <p>Thanks for registering for an account with us.</p>
    <p>Please click the link below to verify your email address.</p>
    <a href="${domain}/auth/new-verification/?token=${token}&email=${email}">Verify Email</a>
    `,
  };
  await sgMail.send(msg);
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  name: string
) => {
  const msg = {
    to: email,
    from: sender,
    subject: 'Reset your password',
    html: `
    <h4>Hi ${name},</h4>
    <p>You have requested to reset your password.</p>
    <p>Please click the link below to reset your password.</p>
    <a href="${domain}/auth/reset-password/?token=${token}&email=${email}">Reset Password</a>
    <p>
    <small> 
    if you did not request a password reset, please ignore this email.
    </small>
    </p>
    `,
  };
  await sgMail.send(msg);
};

export const sendTwoFactorToken = async (email: string, token: string) => {
  const msg = {
    to: email,
    from: sender,
    subject: '2FA Code',
    html: `
    <p>Your two-factor authentication token is:<strong> ${token}</strong></p>
    <p>This token will expire in 10 minutes.</p>
    `,
  };
  await sgMail.send(msg);
};
