const SmsMessage = (otp) => {
  return (
    `Dear User,\n` +
    `${otp} is your otp for Login.Please Enter the OTP to proceed.\n` +
    `OTP Is Valid for only 15 Mintues.\n` +
    `Regards\n` +
    `ToDo Apps`
  );
};

const emailSubject = 'OTP: For Login';

const emailMessage = (otp) => {
  return `<div>
      <p>Dear User,</p>
      <p><strong>OTP for Login is: ${otp}.</strong> This OTP is only valid for 15 Mintues.</p>
      <p>This is a auto-generated email. Please do not reply to this email.</p>
      <p>Regards</p>
      <p>ToDo App</p>
    </div>`;
};

module.exports = { emailSubject, emailMessage, SmsMessage };
