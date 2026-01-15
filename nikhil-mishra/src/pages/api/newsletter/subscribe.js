import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

/* =====================
   Subscribe Handler
====================== */
export default async function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  /* =====================
     Database Connection
  ====================== */
  try {
    await connectDB();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }

  /* =====================
     Request Payload
  ====================== */
  const { email } = req.body;

  /* =====================
     Email Validation
  ====================== */
  if (!email || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  try {
    /* =====================
       Check Existing Subscriber
    ====================== */
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed!",
      });
    }

    /* =====================
       Create Subscriber
    ====================== */
    const newSubscriber = await Subscriber.create({ email });

    /* =====================
       Success Response
    ====================== */
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
