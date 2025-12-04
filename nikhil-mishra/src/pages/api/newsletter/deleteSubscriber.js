import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
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
    const deletedSubscriber = await Subscriber.findOneAndDelete({ email });

    if (!deletedSubscriber) {
      return res.status(404).json({
        success: false,
        message: "Email not found in the subscription list",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email unsubscribed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}
