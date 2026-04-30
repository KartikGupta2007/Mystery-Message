import { Resend } from 'resend';
import VerificationEmail from '../../Email/VerificationEmail';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';


if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}
const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
) : Promise<ApiResponse | ApiError> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message: 'Verification email sent successfully',
    } as ApiResponse;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return new ApiError(
      500, 
      'Failed to send verification email', 
    );
  }

}