import { Resend } from 'resend';
import VerificationEmail from '../../Email/VerificationEmail';


if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}
const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string,
  url: string
) {
  try {
    const {data,error} = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp, url }),
    });
    if(error){
      console.log(error);
      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to send verification email in tryif',
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