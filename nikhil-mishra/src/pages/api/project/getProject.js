import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

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

    /* =====================
       Single Project
    ====================== */
    if (slug) {
      const project = await Project.findOne({ slug });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: project,
      });
    }

    /* =====================
       All Projects
    ====================== */
    const projects = await Project.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
