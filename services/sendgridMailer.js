// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');

const sendEmail = (email, subject, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: 'sanjay.kumar@xorlabs.com', // Change to your verified sender
    subject: subject,
    html: message,
  };

  return sgMail.send(msg);
};

module.exports = sendEmail;
