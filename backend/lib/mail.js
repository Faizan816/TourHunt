const nodemailer = require("nodemailer");

const sendMail = async ({ to, name, subject, body }) => {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.log(error);
  }

  try {
    const sendResult = await transport.sendMail({
      from: `"Tour Hunt" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body,
      headers: {
        "X-Mailer": "Nodemailer", // Identifies the software used to send the email
        "X-Priority": "3", // Sets the priority of the email (3 = Normal)
      },
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendMail;
