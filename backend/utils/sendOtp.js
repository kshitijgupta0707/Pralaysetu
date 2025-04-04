const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
    try {
        console.log("Sending OTP to email:", email);
        console.log("OTP:", otp);
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });
        const mailOptions = {
            from: `"PralaySetu" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "OTP Verification for PralaySetu",
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
          };

        let info = transporter.sendMail(mailOptions)
         console.log("Email sent: " + info);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return false;
    }
};

module.exports = sendOtpEmail;
