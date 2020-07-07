const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   auth: {
  //     user: "atuldadarya@gmail.com",
  //     pass: "London@2020",
  //   },
  // });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atuldadarya@gmail.com",
      pass: "London@2020",
    },
  });

  const message = {
    from: `SmartApp <noreply@smartphonebizapps.com>`,
    to: options.email,
    subject: options.subject,
    //  html: html
    html: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
