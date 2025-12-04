import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const subscribers = await Subscriber.find({}, "email createdAt").sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    console.error("❌ Error fetching subscribers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
