const functions = require("@google-cloud/functions-framework");
const jwt = require("jsonwebtoken");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

functions.cloudEvent("helloPubSub", (cloudEvent) => {
  const base64name = cloudEvent.data.message.data;

  const user = JSON.parse(Buffer.from(base64name, "base64").toString());

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "2m" }
  );

  const verificationLink = `${process.env.ROOT_URL}/verify/${token}`;

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });

  mg.messages
    .create("mail.jaygala25.me", {
      from: `jaygala25 <no-reply@mail.jaygala25.me>`,
      to: user.email,
      subject: "Verify your email address",
      text:
        `Hi ${user.first_name} ${user.last_name}!\n\n
        Please click the link below to verify your email address:\n
        ${verificationLink}`
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
});
