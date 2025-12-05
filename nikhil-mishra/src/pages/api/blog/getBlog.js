import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    await connectDB();

    const { slug } = req.query;

    // -------------------------------------------
    // If slug is provided → return a single blog
    // -------------------------------------------
    if (slug) {
      const blog = await Blog.findOne({ slug });

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });
    }

    // -------------------------------------------
    // Otherwise → return all blogs
    // -------------------------------------------
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
