import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

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
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed!",
      });
    }

    const newSubscriber = await Subscriber.create({ email });

    return res.status(201).json({
      success: true,
      message: "Email subscribed successfully!",
      data: newSubscriber,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
