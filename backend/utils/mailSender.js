import nodemailer from "nodemailer";
const mailSender = async (email, title, body) => {
  try {
    //creating transporter
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "PralaySetu - Bridging Crisis To Safety",
      to: email,
      subject: title,
      html: body,
    };

    //send mail
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    console.log("Issue in sending the mail");
    console.error(e);
    throw e;
  }
};

export {mailSender}