import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    await connectDB();

    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Project slug is required",
      });
    }

    const deletedProject = await Project.findOneAndDelete({ slug });

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
