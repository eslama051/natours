const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  // create transporter
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define the email options
  const mailOptions = {
    from: `eslama051@gmail.com`,
    to: email,
    subject: subject,
    text: message,
  };

  //send the email
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
