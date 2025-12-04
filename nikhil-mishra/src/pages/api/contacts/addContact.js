import connectDB from "@/lib/mongodb";
import Userdata from "@/models/Userdata";

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
    const newUserData = await Userdata.create({
      name,
      email,
      phone,
      subject,
      message_content,
    });

    return res.status(201).json({
      success: true,
      data: newUserData,
    });
  } catch (error) {
    console.error("Error creating User Data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
