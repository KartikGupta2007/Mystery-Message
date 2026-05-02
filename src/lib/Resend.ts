import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '../../Email/VerificationEmail';


if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  throw new Error('Email environment variables are not defined');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});


export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
  url: string
) {
  try {
    const html = await render(VerificationEmail({ username, otp, url }));

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mystery Message Verification Code',
      html,
    });

    if (!info) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to send verification email',
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    console.error('Error sending verification email in catch:', error);
    return {
      success: false,
      statusCode: 500,
      message: 'Failed to send verification email',
    };
  }

}


// imp:
// You're seeing this error because you're using the default resend.dev domain to send emails to recipients other than your own email address (k.a.r.t.i.k.2007.17@gmail.com)1. The resend.dev domain is only available for testing purposes and can only send emails to the email address associated with your Resend account.

// To send emails to other recipients, you need to add and verify your own domain in Resend:

// Go to the Domains page in your Resend dashboard
// Click Add Domain
// Enter your domain name
// Follow the verification steps to add the required DNS records
// Once verified, update your API request to use your verified domain
// After verifying your domain, change the from address in your API request from onboarding@resend.dev to an email using your verified domain (for example, noreply@yourdomain.com).

// For detailed instructions on verifying your domain, check out the 