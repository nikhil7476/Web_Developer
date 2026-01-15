import connectDB from "@/lib/mongodb";
import Userdata from "@/models/Userdata";

/* =====================
   Get User Data Handler
====================== */
export default async function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    /* =====================
       Database Connection
    ====================== */
    await connectDB();

    /* =====================
       Fetch User Data
    ====================== */
    const userDatas = await Userdata.find();

    /* =====================
       Success Response
    ====================== */
    return res.status(200).json({
      success: true,
      data: userDatas,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
