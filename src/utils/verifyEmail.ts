import nodemailer from "nodemailer";
import environment from "../configs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.email,
    pass: environment.password,
  },
});

export const sendMail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: environment.email,
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Error sending email:", error);
      return false;
    } else {
      console.log("Email sent:", info.response);
      return true;
    }
  });
};
