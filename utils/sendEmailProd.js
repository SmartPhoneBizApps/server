const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "rash0474@gmail.com",
      pass: "London2019!",
    },
  });

  const message = {
    from: `SmartApp <noreply@smartphonebizapps.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //console.log(options);

  const info = await transporter.sendMail(message);
  //console.log(info);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
