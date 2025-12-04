import connectDB from "@/lib/mongodb";
import Userdata from "@/models/Userdata";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const userDatas = await Userdata.find();
    return res.status(200).json({ success: true, data: userDatas });
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
