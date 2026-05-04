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
      subject: `Hi ${username}, Welcome to Mystery Messages! Please verify your email address`,
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
