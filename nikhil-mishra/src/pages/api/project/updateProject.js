import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    await connectDB();

    const body = req.body;

    if (!body.slug) {
      return res.status(400).json({
        success: false,
        message: "Project slug is required for update",
      });
    }

    /* =====================
       Build Update Object
    ====================== */
    const updateFields = {
      ...(body.title && { title: body.title }),
      ...(body.bannerDescription && {
        bannerDescription: body.bannerDescription,
      }),

      ...(body.tag && { tag: body.tag }),
      ...(body.featureList && { featureList: body.featureList }),

      ...(body.problem && { problem: body.problem }),
      ...(body.problemStatement && {
        problemStatement: body.problemStatement,
      }),
      ...(body.solution && { solution: body.solution }),
      ...(body.solutionOverview && {
        solutionOverview: body.solutionOverview,
      }),

      ...(body.featuredImage && { featuredImage: body.featuredImage }),
      ...(body.bannerImage && { bannerImage: body.bannerImage }),
      ...(body.problemImage && { problemImage: body.problemImage }),
      ...(body.solutionImage && { solutionImage: body.solutionImage }),
      ...(body.galleryImages && {
        galleryImages: body.galleryImages,
      }),
      ...(body.technologiesUsedImages && {
        technologiesUsedImages: body.technologiesUsedImages,
      }),

      ...(body.technologiesUsed && {
        technologiesUsed: body.technologiesUsed,
      }),
      ...(body.projectLink && { projectLink: body.projectLink }),
      ...(body.githubLink && { githubLink: body.githubLink }),

      ...(body.learned && { learned: body.learned }),
      ...(body.whatIlearned && { whatIlearned: body.whatIlearned }),
      ...(body.faq && { faq: body.faq }),
    };

    const updatedProject = await Project.findOneAndUpdate(
      { slug: body.slug },
      updateFields,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
