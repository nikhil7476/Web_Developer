import connectDB from "@/lib/mongodb";
import Userdata from "@/models/Userdata";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }

  const { name, email, phone, subject, message_content } = req.body;

  if (!name || !email || !phone || !subject || !message_content) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: name, email, phone, subject, message_content",
    });
  }

  try {
    // Save to database
    const newUserData = await Userdata.create({
      name,
      email,
      phone,
      subject,
      message_content,
    });

    // -----------------------------
    // Send Email to the User
    // -----------------------------

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER,
      port: process.env.EMAIL_PORT,
      secure: true, // true for 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Thanks for contacting us — ${subject}`,
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting us! We have received your message and will get back to you shortly.</p>

        <h3>Your Message Details:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message_content}</p>

        <br/>
        <p>Best regards,</p>
        <p><strong>Niktech Team</strong></p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Contact form submitted and email sent successfully.",
      data: newUserData,
    });
  } catch (error) {
    console.error("Error creating user data or sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
