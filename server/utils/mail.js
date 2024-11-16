const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_AUTH_PASS,
    pass: process.env.MAIL_AUTH_USER, // app password - google manage your account
  },
});

const sendEmail = (to, name) => {
  const html = `<div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <div style="text-align: center; padding: 20px; background-color: #4a90e2; color: #ffffff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <h1 style="margin: 0;">Welcome to PernApp!</h1>
    </div>
    <div style="padding: 20px; line-height: 1.6; color: #333333;">
        <h2 style="color: #4a90e2;">Hi ${name},</h2>
        <p style="margin: 0 0 10px 0;">We're thrilled to have you onboard! 🎉 Thank you for joining our community. At PernApp, we're here to help you get the most out of your experience and make everything as smooth as possible.</p>
        <p style="margin: 0 0 10px 0;">To get started, you can explore your account and check out all the exciting features we have to offer. Our goal is to support you every step of the way!</p>
        <a href="http://localhost:5173/" style="display: inline-block; padding: 10px 20px; margin-top: 20px; color: #ffffff; background-color: #4a90e2; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Your Dashboard</a>
        <p style="margin: 20px 0 10px 0;">If you have any questions, feel free to reach out. We're always here to help!</p>
        <p style="margin: 0 0 10px 0;">Enjoy your journey with us!</p>
        <p style="margin: 0;">Best regards,<br>The PernApp Team</p>
    </div>
    <div style="text-align: center; padding: 10px; font-size: 0.9em; color: #777777;">
        <p style="margin: 0;">Need assistance? <a href="mailto:angelflawed@gmail.com" style="color: #4a90e2; text-decoration: none;">Contact Support</a></p>
        <p style="margin: 5px 0 0 0;">&copy; 2024 PernApp. All rights reserved.</p>
    </div>
  </div>
  `;

  // Send email function without specifying the sender address
  const mailOptions = {
    from: process.env.MAIL_AUTH_USER,
    to: to,
    subject: `Greetings, ${name}`,
    text: `Welcome aboard, ${name}! We're thrilled to have you onboard! 🎉 Thank you for joining our community. At [Platform Name], we're here to help you get the most out of your experience and make everything as smooth as possible.`,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error: ", error);
    }
    console.log("Email sent: " + info.response);
  });
};

module.exports = sendEmail;
