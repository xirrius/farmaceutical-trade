const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS, // app password - google manage your account
  },
});

const sendEmail = (to, name) => {
  const html = `
<div style="width: 92%; max-width: 560px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <!-- English Section -->
    <div style="text-align: center; padding: 20px; background-color: #4caf50; color: #ffffff; border-top-left-radius: 10px; border-top-right-radius: 10px;">
        <h1 style="margin: 0;">Welcome to Farmaceutical Trade!</h1>
    </div>
    <div style="padding: 20px; line-height: 1.6; color: #333333;">
        <h2 style="color: #4caf50;">Hi ${name},</h2>
        <p style="margin: 0 0 10px 0;">We're delighted to have you join our platform! 🌱 Thank you for being a part of our community. At Farmaceutical Trade, we aim to simplify agricultural trade and make it seamless for farmers and buyers alike.</p>
        <p style="margin: 0 0 10px 0;">Start exploring your account and discover all the features we have to offer. Together, we can help your farming business thrive!</p>
        <a href="https://farmaceutical-trade.vercel.app/" style="display: inline-block; padding: 10px 20px; margin-top: 20px; color: #ffffff; background-color: #4caf50; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Our Platform!</a>
        <p style="margin: 20px 0 10px 0;">If you have any questions or need assistance, don't hesitate to reach out. We're here to support you every step of the way!</p>
        <p style="margin: 0 0 10px 0;">Thank you for choosing Farmaceutical Trade.</p>
        <p style="margin: 0;">Best regards,<br>The Farmaceutical Trade Team</p>
    </div>

    <!-- Hindi Section -->
    <div style="padding: 20px; line-height: 1.6; color: #333333; margin-top: 30px;">
        <h2 style="color: #4caf50;">नमस्ते ${name},</h2>
        <p style="margin: 0 0 10px 0;">हमारा प्लेटफ़ॉर्म जॉइन करने के लिए धन्यवाद! 🌱 हम आपके समुदाय का हिस्सा बनने के लिए खुश हैं। Farmaceutical Trade में, हमारा उद्देश्य कृषि व्यापार को सरल बनाना है ताकि किसानों और खरीदारों के लिए यह सहज हो सके।</p>
        <p style="margin: 0 0 10px 0;">अपने खाते की खोज शुरू करें और हमारे द्वारा प्रदान की जाने वाली सभी सुविधाओं का अनुभव करें। साथ मिलकर, हम आपके कृषि व्यवसाय को समृद्ध बनाने में मदद कर सकते हैं!</p>
        <a href="https://farmaceutical-trade.vercel.app/" style="display: inline-block; padding: 10px 20px; margin-top: 20px; color: #ffffff; background-color: #4caf50; text-decoration: none; border-radius: 5px; font-weight: bold;">हमारे प्लेटफ़ॉर्म का अन्वेषण करें!</a>
        <p style="margin: 20px 0 10px 0;">यदि आपके पास कोई प्रश्न हैं या आपको सहायता की आवश्यकता है, तो कृपया संपर्क करें। हम हर कदम पर आपकी सहायता के लिए यहाँ हैं!</p>
        <p style="margin: 0 0 10px 0;">Farmaceutical Trade को चुनने के लिए धन्यवाद।</p>
        <p style="margin: 0;">सादर,<br>Farmaceutical Trade टीम</p>
    </div>
    
    <!-- Footer Section -->
    <div style="text-align: center; padding: 10px; font-size: 0.9em; color: #777777; margin-top: 30px;">
        <p style="margin: 0;">Need assistance? <a href="mailto:angelflawed@gmail.com" style="color: #4caf50; text-decoration: none;">Contact Support</a></p>
        <p style="margin: 5px 0 0 0;">&copy; 2024 Farmaceutical Trade. All rights reserved.</p>
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
