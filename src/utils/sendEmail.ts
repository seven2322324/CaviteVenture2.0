import nodemailer from 'nodemailer';

interface SendEmailParams {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async ({ email, subject, message }: SendEmailParams) => {
  if (!email) {
    throw new Error('Recipient email is undefined');
  }

  try {
    // Setup Nodemailer transporter using SMTP details from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CaviteVenture" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw new Error('Email sending failed');
  }
};

export default sendEmail;
