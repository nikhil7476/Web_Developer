import connectDB from "@/lib/mongodb";
import Userdata from "@/models/Userdata";

/* =====================
   Delete User Data Handler
====================== */
export default async function handler(req, res) {
  /* =====================
     Method Validation
  ====================== */
  if (req.method !== "DELETE") {
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
       Request Parameters
    ====================== */
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to delete user details",
      });
    }

    /* =====================
       Delete User Data
    ====================== */
    const deletedUser = await Userdata.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User details not found",
      });
    }

    /* =====================
       Success Response
    ====================== */
    return res.status(200).json({
      success: true,
      message: "User details deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
