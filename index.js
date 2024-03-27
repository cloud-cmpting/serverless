const functions = require("@google-cloud/functions-framework");
const jwt = require("jsonwebtoken");
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const { insertToken } = require("./database.js");

functions.cloudEvent("helloPubSub", async (cloudEvent) => {
  const base64name = cloudEvent.data.message.data;
  const user = JSON.parse(Buffer.from(base64name, "base64").toString());
  
  const verificationLink = `${process.env.ROOT_URL}/verify/${user.token}`;

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });

  await insertToken(user);

  mg.messages
    .create("mail.jaygala25.me", {
      from: `jaygala25 <no-reply@mail.jaygala25.me>`,
      to: user.email,
      subject: "Please Verify Your Email Address",
      text:
        `Hello ${user.first_name} ${user.last_name}!\n\n` +
        `Welcome to our website! We're excited to have you here.\n\n` +
        `Thank you for registering at our website. Please click on the following link to verify your email address:${verificationLink}\n\n` +
        `If you did not request this, please ignore this email.\n\n` +
        `Best regards,\n` +
        `Jay Gala`,
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
});
