import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

/* =====================
   Delete Blog Handler
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
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required to delete a blog",
      });
    }

    /* =====================
       Delete Blog
    ====================== */
    const deletedBlog = await Blog.findOneAndDelete({ slug });

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    /* =====================
       Success Response
    ====================== */
    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
