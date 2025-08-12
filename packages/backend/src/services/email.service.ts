import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  // For dev/testing use ethereal or log-only mode
  const transport = nodemailer.createTransport({ jsonTransport: true });
  const info = await transport.sendMail({ to, subject, text, from: 'no-reply@smartrelief.local' });
  return info;
};
